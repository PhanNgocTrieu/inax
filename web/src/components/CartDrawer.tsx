'use client'
import Link from 'next/link'
import { bgImage } from '@/lib/texture'
import { fmt, num } from './format'
import { useShop, type CartLine } from './Providers'
import { Icon } from './Sprite'

export function ShipBar() {
  const { subtotal, settings } = useShop()
  const th = settings.freeShipThreshold ?? 5000000, left = th - subtotal
  return (
    <div className="free-ship">
      {left > 0 ? <>Mua thêm <b>{fmt(left)}</b> để được <b>miễn phí giao hàng</b> nội thành</> : <>🎉 Đơn hàng được <b>miễn phí giao hàng</b> nội thành Đà Nẵng</>}
      <div className="bar"><i style={{ width: `${Math.min(100, (subtotal / th) * 100)}%` }} /></div>
    </div>
  )
}

export function LineItem({ l, big }: { l: CartLine; big?: boolean }) {
  const { step, remove } = useShop()
  return (
    <div className="line-item">
      <Link href={`/san-pham/${l.slug}`} className="line-item__img" style={{ backgroundImage: bgImage(l.img, l.tex) }} aria-label={l.name} />
      <div>
        <Link href={`/san-pham/${l.slug}`} className="line-item__name">{l.name}</Link>
        <div className="line-item__var">{[l.size, l.finish].filter(Boolean).join(' · ')} · {fmt(l.price)}/{l.unit}</div>
        <div className="line-item__row">
          <div className="qty qty--sm">
            <button onClick={() => step(l.key, -1)} aria-label="Giảm"><Icon name="minus" className="" /></button>
            <input value={num(l.qty)} readOnly aria-label="Số lượng" />
            <button onClick={() => step(l.key, 1)} aria-label="Tăng"><Icon name="plus" className="" /></button>
          </div>
          <span className="muted" style={{ fontSize: 13, marginRight: 'auto' }}>{l.unit}</span>
          {!big && <b>{fmt(l.price * l.qty)}</b>}
        </div>
        <button className="rm" onClick={() => remove(l.key)}><Icon name="trash" /> Xóa</button>
      </div>
      {big && <b style={{ fontSize: 16 }}>{fmt(l.price * l.qty)}</b>}
    </div>
  )
}

export function CartDrawer() {
  const { lines, subtotal, cartOpen, setCartOpen } = useShop()
  return (
    <aside className={`drawer drawer--right ${cartOpen ? 'is-open' : ''}`} aria-label="Giỏ hàng" aria-hidden={!cartOpen}>
      <div className="drawer__head"><h3>Giỏ hàng ({lines.length})</h3>
        <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Đóng"><Icon name="close" className="" /></button></div>
      {lines.length > 0 && <ShipBar />}
      <div className="drawer__body">
        {lines.length ? lines.map((l) => <LineItem key={l.key} l={l} />) : <div className="empty"><h3>Giỏ hàng trống</h3><p>Hãy chọn vài mẫu vật liệu bạn yêu thích.</p></div>}
      </div>
      <div className="drawer__foot">
        {lines.length ? <>
          <div className="sum-row sum-row--total" style={{ border: 0, margin: 0, paddingTop: 0 }}><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 16 }}>Phí vận chuyển & mã giảm giá tính ở bước thanh toán</p>
          <Link href="/thanh-toan" className="btn btn--primary btn--block">Thanh toán <Icon name="arrow" /></Link>
          <Link href="/gio-hang" className="btn btn--outline btn--block" style={{ marginTop: 8 }}>Xem giỏ hàng</Link>
        </> : <Link href="/san-pham" className="btn btn--primary btn--block">Khám phá sản phẩm</Link>}
      </div>
    </aside>
  )
}
