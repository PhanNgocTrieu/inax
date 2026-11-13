'use client'
import Link from 'next/link'
import { LineItem, ShipBar } from './CartDrawer'
import { fmt } from './format'
import { useShop } from './Providers'
import { Icon } from './Sprite'

export function CartPage() {
  const { lines, subtotal, ready, openQuote } = useShop()
  if (!ready) return <div className="container" style={{ minHeight: '50vh' }} />
  if (!lines.length) return (
    <div className="container empty" style={{ padding: '120px 20px' }}>
      <Icon name="bag" style={{ width: 48, height: 48, margin: '0 auto 20px', color: 'var(--muted)' }} />
      <h3>Giỏ hàng đang trống</h3><p>Khám phá hàng nghìn mẫu vật liệu chính hãng.</p>
      <p style={{ marginTop: 24 }}><Link className="btn btn--primary" href="/san-pham">Mua sắm ngay <Icon name="arrow" /></Link></p>
    </div>
  )
  return (
    <>
      <div className="container page-head"><h1 className="display h2" style={{ marginTop: 18 }}>Giỏ hàng <span className="muted" style={{ fontSize: '.5em' }}>({lines.length} sản phẩm)</span></h1></div>
      <div className="container cart-page">
        <div>
          <div style={{ borderRadius: 'var(--r)', overflow: 'hidden' }}><ShipBar /></div>
          <div className="cart-table">{lines.map((l) => <LineItem key={l.key} l={l} big />)}</div>
          <Link href="/san-pham" className="link" style={{ marginTop: 24 }}>← Tiếp tục mua sắm</Link>
        </div>
        <aside className="summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="sum-row"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
          <div className="sum-row"><span>Vận chuyển</span><span>Tính ở bước thanh toán</span></div>
          <div className="sum-row sum-row--total"><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
          <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Đã bao gồm VAT · Mã giảm giá nhập ở bước thanh toán</p>
          <Link href="/thanh-toan" className="btn btn--primary btn--block" style={{ marginTop: 20 }}>Tiến hành thanh toán <Icon name="arrow" /></Link>
          <button className="btn btn--outline btn--block" style={{ marginTop: 10 }} onClick={() => openQuote({ mode: 'quote', product: '__cart' })}>Gửi giỏ hàng để nhận báo giá</button>
          <div className="secure"><Icon name="lock" /> Thanh toán bảo mật SSL</div>
        </aside>
      </div>
    </>
  )
}
