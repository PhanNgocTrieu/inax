import type { MetadataRoute } from 'next'
import { getCategories, getProducts } from '@/lib/data'

export const revalidate = 3600
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const [cats, products] = await Promise.all([getCategories(), getProducts({}, 5000)])
  return [
    ...['', '/san-pham', '/du-an', '/gioi-thieu', '/lien-he', '/chinh-sach'].map((p) => ({ url: base + p })),
    ...cats.map((c) => ({ url: `${base}/san-pham?cat=${c.slug}` })),
    ...products.map((p) => ({ url: `${base}/san-pham/${p.slug}` })),
  ]
}
