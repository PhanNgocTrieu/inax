import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Crumbs } from '@/components/Crumbs'
import { fmt } from '@/components/format'
import { ProductCard } from '@/components/ProductCard'
import { Accordion, BuyBox, Gallery } from '@/components/ProductDetail'
import { Icon } from '@/components/Sprite'
import { ROOMS } from '@/lib/constants'
import { getCategories, getProduct, getProducts } from '@/lib/data'

export const revalidate = 60
type P = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: P }): Promise<Metadata> {
  const p = await getProduct((await params).slug)
  if (!p) return {}
  return { title: p.name, description: p.description || `${p.name} – ${p.cat.name} chính hãng, giá ${fmt(p.price)}/${p.unit}. Giao nhanh tại Đà Nẵng.`, openGraph: { images: p.images.slice(0, 1) } }
}

export default async function ProductPage({ params }: { params: P }) {
  const p = await getProduct((await params).slug)
  if (!p) notFound()
  const cat = (await getCategories()).find((c) => c.slug === p.cat.slug)
  const related = (await getProducts({ category: { equals: cat?.id ?? 0 }, id: { not_equals: p.id } }, 4))
  const more = related.length < 4 ? (await getProducts({ id: { not_equals: p.id } }, 8)).filter((x) => !related.some((r) => r.id === x.id)).slice(0, 4 - related.length) : []
  const specs = [
    ...(p.sku ? [{ label: 'Mã sản phẩm', value: p.sku }] : []),
    ...(p.sizes.length ? [{ label: 'Kích thước', value: p.sizes.join(', ') }] : []),
    ...(p.finishes.length ? [{ label: 'Bề mặt', value: p.finishes.join(', ') }] : []),
    ...(p.origin ? [{ label: 'Xuất xứ', value: p.origin }] : []),
    ...(p.brand ? [{ label: 'Thương hiệu', value: p.brand }] : []),
    ...(p.boxM2 ? [{ label: 'Quy cách', value: `${p.boxM2} m²/hộp` }] : []),
    ...p.specs,
  ]
  const warranty = p.specs.find((s) => /bảo hành/i.test(s.label))?.value
  const roomNames = p.rooms.map((r) => ROOMS.find((x) => x.id === r)?.name.toLowerCase()).filter(Boolean).join(', ')
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku || undefined, brand: p.brand || undefined, image: p.images,
    offers: { '@type': 'Offer', priceCurrency: 'VND', price: p.price, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder' },
  }
  return (
    <>
      <div className="container page-head" style={{ paddingBottom: 16 }}><Crumbs items={[['Sản phẩm', '/san-pham'], [p.cat.name, `/san-pham?cat=${p.cat.slug}`], [p.name]]} /></div>
      <div className="container"><div className="pdp">
        <Gallery p={p} />
        <div className="pdp__info">
          <p className="eyebrow">{p.cat.name}</p>
          <h1>{p.name}</h1>
          <div className="pdp__sku">
            {p.sku && <span>Mã: {p.sku}</span>}{p.origin && <span>Xuất xứ: {p.origin}</span>}
            {p.stock > 0 ? <span style={{ color: 'var(--ok)' }}>● Còn hàng tại kho Đà Nẵng</span> : <span style={{ color: 'var(--clay)' }}>● Đặt hàng 7–14 ngày</span>}
          </div>
          <div className="pdp__price">{fmt(p.price)} <small>/ {p.unit}</small>{p.oldPrice ? <s>{fmt(p.oldPrice)}</s> : null}</div>
          <div className="pdp__vat">Giá đã bao gồm VAT · Chiết khấu riêng cho nhà thầu & đơn hàng công trình</div>
          <BuyBox p={p} warranty={warranty} />
          <Accordion title="Mô tả sản phẩm" open>
            <p>{p.description || `${p.name} mang đến vẻ đẹp bền vững cho ${roomNames || 'không gian của bạn'}. Sản phẩm${p.origin ? ` xuất xứ ${p.origin},` : ''} đáp ứng tiêu chuẩn chất lượng cho cả nhà ở và công trình thương mại.`}</p>
          </Accordion>
          <Accordion title="Thông số kỹ thuật"><table className="spec"><tbody>{specs.map((s) => <tr key={s.label}><td>{s.label}</td><td>{s.value}</td></tr>)}</tbody></table></Accordion>
          <Accordion title="Hướng dẫn thi công & bảo quản">
            <p>Thi công trên nền phẳng, khô, sạch. Sử dụng keo/vữa chuyên dụng và ke cân bằng. Vệ sinh bằng dung dịch trung tính, tránh axit mạnh. Đội ngũ GreenHabitat hỗ trợ kỹ thuật tại công trình khi cần.</p>
          </Accordion>
          {p.documents.length > 0 && <Accordion title="Tài liệu tải về"><div className="docs">
            {p.documents.map((d) => d.url && <a key={d.title} href={d.url} target="_blank" rel="noopener"><Icon name="download" /> {d.title}</a>)}
          </div></Accordion>}
        </div>
      </div></div>
      <section className="section section--white"><div className="container">
        <div className="section__head"><div><p className="eyebrow">Gợi ý cho bạn</p><h2 className="display h2">Sản phẩm liên quan</h2></div></div>
        <div className="p-grid">{[...related, ...more].map((x) => <ProductCard key={x.id} p={x} />)}</div>
      </div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  )
}
