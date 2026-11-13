import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Category, Media, Product, Project, Setting } from '@/payload-types'
import type { TexSpec } from './texture'

export const payloadClient = cache(() => getPayload({ config }))

export type CatView = { id: number; slug: string; name: string; short: string; img: string | null; tex: TexSpec | null }
export type ProductView = {
  id: number; slug: string; name: string; sku: string; cat: { slug: string; name: string }
  price: number; oldPrice: number | null; unit: string; boxM2: number | null; stock: number
  sizes: string[]; finishes: string[]; rooms: string[]; color: string; origin: string; brand: string
  badges: string[]; img: string | null; images: string[]; tex: TexSpec | null; featured: boolean
  description: string; specs: { label: string; value: string }[]; documents: { title: string; url: string | null }[]
}
export type ProjectView = { id: number; slug: string; name: string; type: string; year: number | null; area: string; materials: string; img: string | null; tex: TexSpec | null }

const mediaUrl = (m: unknown, size: 'card' | 'large' | 'thumb' = 'card'): string | null => {
  if (!m || typeof m !== 'object') return null
  const md = m as Media
  return md.sizes?.[size]?.url || md.url || null
}

export const toCat = (c: Category): CatView => ({
  id: c.id, slug: c.slug, name: c.name, short: c.short || '', img: mediaUrl(c.image), tex: (c.texture as TexSpec) || null,
})
export const toProduct = (p: Product): ProductView => {
  const cat = typeof p.category === 'object' ? p.category : null
  const imgs = (p.images || []).map((m) => mediaUrl(m, 'large')).filter(Boolean) as string[]
  return {
    id: p.id, slug: p.slug, name: p.name, sku: p.sku || '', cat: { slug: cat?.slug || '', name: cat?.name || '' },
    price: p.price, oldPrice: p.oldPrice || null, unit: p.unit, boxM2: p.boxM2 || null, stock: p.stock || 0,
    sizes: p.sizes || [], finishes: p.finishes || [], rooms: p.rooms || [], color: p.color || '', origin: p.origin || '', brand: p.brand || '',
    badges: p.badges || [], img: mediaUrl(p.images?.[0]), images: imgs, tex: (p.texture as TexSpec) || null, featured: Boolean(p.featured),
    description: p.description || '', specs: (p.specs || []).map((s) => ({ label: s.label, value: s.value })),
    documents: (p.documents || []).map((d) => ({ title: d.title, url: mediaUrl(d.file) })),
  }
}
export const toProject = (p: Project): ProjectView => ({
  id: p.id, slug: p.slug, name: p.name, type: p.type || '', year: p.year || null, area: p.area || '', materials: p.materials || '',
  img: mediaUrl(p.cover), tex: (p.texture as TexSpec) || null,
})

export const getSettings = cache(async (): Promise<Setting> => (await payloadClient()).findGlobal({ slug: 'settings', depth: 0 }))

export const getCategories = cache(async () => {
  const { docs } = await (await payloadClient()).find({ collection: 'categories', sort: 'order', limit: 100, depth: 1 })
  return docs.map(toCat)
})

export async function getProducts(where: Where = {}, limit = 200) {
  const { docs } = await (await payloadClient()).find({
    collection: 'products', where: { and: [{ published: { equals: true } }, where] }, limit, depth: 1, sort: '-featured',
  })
  return docs.map(toProduct)
}

export const getProduct = cache(async (slug: string) => {
  const { docs } = await (await payloadClient()).find({
    collection: 'products', where: { slug: { equals: slug }, published: { equals: true } }, limit: 1, depth: 1,
  })
  return docs[0] ? toProduct(docs[0]) : null
})

export const getProjects = cache(async (limit = 50) => {
  const { docs } = await (await payloadClient()).find({ collection: 'projects', limit, depth: 1 })
  return docs.map(toProject)
})

/** Thông tin công khai gửi xuống client */
export type PublicSettings = Pick<Setting, 'legalName' | 'taxCode' | 'address' | 'hotline' | 'zalo' | 'email' | 'hours' | 'mapEmbed' | 'mapLink' | 'brands' | 'freeShipThreshold' | 'innerCityFee' | 'provinceFee' | 'codLimit' | 'depositPercent' | 'enabledPayments'>
export const publicSettings = (s: Setting): PublicSettings => ({
  legalName: s.legalName, taxCode: s.taxCode, address: s.address, hotline: s.hotline, zalo: s.zalo, email: s.email, hours: s.hours,
  mapEmbed: s.mapEmbed, mapLink: s.mapLink, brands: s.brands, freeShipThreshold: s.freeShipThreshold, innerCityFee: s.innerCityFee,
  provinceFee: s.provinceFee, codLimit: s.codLimit, depositPercent: s.depositPercent, enabledPayments: s.enabledPayments,
})
