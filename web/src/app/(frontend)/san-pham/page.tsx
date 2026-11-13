import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { Catalog } from '@/components/Catalog'
import { Crumbs } from '@/components/Crumbs'
import { ROOMS } from '@/lib/constants'
import { getCategories, getProducts } from '@/lib/data'
import { bgImage, texture } from '@/lib/texture'

type SP = Promise<{ cat?: string; room?: string; q?: string }>

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { cat } = await searchParams
  const c = cat ? (await getCategories()).find((x) => x.slug === cat) : null
  return { title: c ? c.name : 'Sản phẩm', description: c?.short || 'Gạch ốp lát, đá, sàn gỗ, thiết bị vệ sinh và vật liệu hoàn thiện chính hãng.' }
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const { cat, room, q } = await searchParams
  const cats = await getCategories()
  const c = cat ? cats.find((x) => x.slug === cat) : undefined
  const r = room ? ROOMS.find((x) => x.id === room) : undefined
  const where: Where = {}
  if (c) where.category = { equals: c.id }
  if (q) where.name = { like: q }
  const products = await getProducts(where, 500)
  const title = c ? c.name : r ? r.name : q ? `Kết quả cho “${q}”` : 'Tất cả sản phẩm'
  const sub = c ? c.short : r ? r.desc : 'Vật liệu chính hãng cho nhà ở và công trình.'
  const bannerBg = c ? bgImage(c.img, c.tex) : texture(r ? r.tex : cats[1]?.tex)
  return (
    <>
      <section className="page-banner"><div className="bg" style={{ backgroundImage: bannerBg }} />
        <div className="container">
          <Crumbs items={c || r ? [['Sản phẩm', '/san-pham'], [title]] : [['Sản phẩm']]} />
          <h1 className="display h1" style={{ margin: '18px 0 12px' }}>{title}</h1><p className="lead">{sub}</p>
        </div>
      </section>
      <div className="container">
        <div className="cat-chips" style={{ paddingTop: 24 }}>
          <Link href="/san-pham" className={`chip-btn chip-btn--plain ${!c && !r ? 'is-active' : ''}`}>Tất cả</Link>
          {cats.map((x) => <Link key={x.id} href={`/san-pham?cat=${x.slug}`} className={`chip-btn ${c?.id === x.id ? 'is-active' : ''}`}><span className="t" style={{ backgroundImage: bgImage(x.img, x.tex) }} />{x.name}</Link>)}
        </div>
        <Catalog key={`${cat}-${room}-${q}`} products={products} initialRoom={r?.id} />
      </div>
    </>
  )
}
