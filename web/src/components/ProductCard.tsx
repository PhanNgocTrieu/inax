'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { ProductView } from '@/lib/data'
import { bgImage } from '@/lib/texture'
import { fmt } from './format'
import { useShop } from './Providers'
import { Icon } from './Sprite'

export const toAdd = (p: ProductView) => ({
  id: p.id, slug: p.slug, name: p.name, catName: p.cat.name, price: p.price, unit: p.unit, boxM2: p.boxM2,
  img: p.img, tex: p.tex, sizes: p.sizes, finishes: p.finishes,
})

export function ProductCard({ p }: { p: ProductView }) {
  const { add, openQuote, favs, toggleFav } = useShop()
  const bg = bgImage(p.img, p.tex)
  const fav = favs.includes(p.id)
  return (
    <article className="p-card reveal">
      <div className="p-card__media">
        <Link href={`/san-pham/${p.slug}`} aria-label={p.name}>
          <div className="p-card__img" style={{ backgroundImage: bg }} />
          <div className="p-card__img p-card__img--alt" style={{ backgroundImage: p.images[1] ? `url('${p.images[1]}')` : bg, backgroundSize: p.images[1] ? 'cover' : undefined }} />
        </Link>
        <div className="p-card__badges">
          {p.badges.map((b) => <span key={b} className={`badge ${b === 'Ưu đãi' ? 'badge--sale' : b === 'Mới' ? 'badge--new' : ''}`}>{b}</span>)}
          {p.oldPrice ? <span className="badge badge--sale">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span> : null}
        </div>
        <button className={`p-card__fav ${fav ? 'is-on' : ''}`} onClick={() => toggleFav(p.id)} aria-label="Yêu thích" aria-pressed={fav}><Icon name="heart" className="" /></button>
        <div className="p-card__quick">
          <button className="btn btn--primary" onClick={() => add(toAdd(p))}><Icon name="bag" /> Thêm vào giỏ</button>
          <button className="btn btn--light" title="Đặt mẫu" aria-label="Đặt mẫu" onClick={() => openQuote({ mode: 'sample', product: p.name, tex: p.tex, img: p.img })}><Icon name="swatch" /></button>
        </div>
      </div>
      <div className="p-card__body">
        <div className="p-card__cat">{p.cat.name}</div>
        <h3 className="p-card__name"><Link href={`/san-pham/${p.slug}`}>{p.name}</Link></h3>
        <div className="p-card__meta"><div className="price">{fmt(p.price)}<small>/{p.unit}</small>{p.oldPrice ? <s>{fmt(p.oldPrice)}</s> : null}</div></div>
        <div className="p-card__sizes">{p.sizes.join(' · ')}</div>
      </div>
    </article>
  )
}

export function HomeTabs({ products }: { products: ProductView[] }) {
  return <TabsInner products={products} />
}
function TabsInner({ products }: { products: ProductView[] }) {
  const tabs = [['Bán chạy', 'Bán chạy'], ['Mới', 'Mới về'], ['Ưu đãi', 'Ưu đãi']]
  const [tab, setTab] = useState('Bán chạy')
  const list = products.filter((p) => p.badges.includes(tab) || (tab === 'Ưu đãi' && p.oldPrice)).slice(0, 4)
  return (
    <>
      <div className="section__head reveal">
        <div><p className="eyebrow">Sản phẩm nổi bật</p><h2 className="display h2">Được khách hàng & kiến trúc sư tin chọn</h2></div>
        <div className="tabs" role="tablist">{tabs.map(([v, l]) => <button key={v} role="tab" aria-selected={tab === v} className={tab === v ? 'is-active' : ''} onClick={() => setTab(v)}>{l}</button>)}</div>
      </div>
      <div className="p-grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </>
  )
}
