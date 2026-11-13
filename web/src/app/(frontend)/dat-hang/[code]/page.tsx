import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { fmt, num } from '@/components/format'
import { AutoRefresh } from '@/components/OrderClient'
import { Icon } from '@/components/Sprite'
import { ORDER_STATUS_VI, PAY_INFO } from '@/lib/constants'
import { vietqrImage } from '@/lib/payments/vietqr'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Đơn hàng', robots: { index: false } }

export default async function OrderPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string }> }) {
  const [{ code }, { t }] = await Promise.all([params, searchParams])
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: code } }, limit: 1, overrideAccess: true, depth: 0 })
  const o = docs[0]
  if (!o || !t || o.accessToken !== t) notFound()
  const s = await payload.findGlobal({ slug: 'settings' })

  const pm = o.paymentMethod || 'cod'
  const remaining = Math.max(0, (o.amountDue || o.total) - (o.paidAmount || 0))
  const needTransfer = (pm === 'bank' || pm === 'deposit') && remaining > 0 && o.status !== 'cancelled'
  const failed = o.status === 'failed'
  const paidOk = ['paid', 'deposit_paid'].includes(o.status)
  const qr = needTransfer ? vietqrImage(s, remaining, o.code) : null
  const steps = ['Đã đặt hàng', pm === 'cod' ? 'Đã xác nhận' : 'Đã thanh toán', 'Đang giao', 'Hoàn tất']
  const reached = { pending_payment: 1, pending_confirm: 1, failed: 1, deposit_paid: 2, paid: 2, processing: 2, shipping: 3, completed: 4, cancelled: 0 }[o.status] ?? 1

  return (
    <div className="container success">
      <AutoRefresh active={needTransfer} />
      <div className="success__icon" style={failed ? { background: '#f6e3df', color: 'var(--danger)' } : undefined}><Icon name={failed ? 'close' : 'check'} className="" /></div>
      <p className="eyebrow">Mã đơn hàng {o.code} · {ORDER_STATUS_VI[o.status]}</p>
      <h1 className="display h2" style={{ marginTop: 12 }}>
        {failed ? 'Thanh toán chưa thành công' : paidOk ? `Cảm ơn ${o.customerName}, thanh toán thành công!` : `Cảm ơn ${o.customerName}, đơn hàng đã được ghi nhận!`}
      </h1>
      <p className="lead" style={{ margin: '0 auto' }}>
        {failed ? 'Giao dịch bị hủy hoặc không thành công. Bạn có thể chuyển khoản theo thông tin bên dưới hoặc liên hệ hotline để được hỗ trợ.'
          : `Chuyên viên sẽ liên hệ số ${o.customerPhone} để xác nhận và hẹn lịch giao hàng.`}
      </p>

      {(needTransfer || failed) && (
        <div className="order-card">
          <h3 className="display h3" style={{ marginBottom: 16 }}>Chuyển khoản {pm === 'deposit' ? 'tiền cọc' : 'để hoàn tất'}</h3>
          <div className="qr-wrap">
            {qr ? <img className="qr" src={qr} alt={`Mã QR chuyển khoản đơn ${o.code}`} /> : <div className="qr" style={{ display: 'grid', placeItems: 'center', fontSize: 12, textAlign: 'center' }}>Chưa cấu hình tài khoản nhận tiền</div>}
            <div className="bank-info">
              <span>Ngân hàng: <b>{s.bankName || s.bankCode || '(chưa cấu hình)'}</b></span>
              <span>Số tài khoản: <b>{s.bankAccount || '(chưa cấu hình)'}</b></span>
              <span>Chủ tài khoản: <b>{s.bankAccountName}</b></span>
              <span>Số tiền: <b>{fmt(failed ? o.total : remaining)}</b></span>
              <span>Nội dung: <b>{o.code}</b></span>
              {needTransfer && <span className="muted" style={{ fontSize: 12 }}>Trang tự cập nhật khi nhận được tiền.</span>}
            </div>
          </div>
        </div>
      )}

      <div className="order-card">
        {o.items.map((i) => (
          <div key={i.id} className="sum-row"><span>{i.name} <span className="muted">· {[i.size, i.finish].filter(Boolean).join(' · ')} × {num(i.qty)} {i.unit}</span></span><span>{fmt(i.lineTotal)}</span></div>
        ))}
        <div className="sum-row" style={{ borderTop: '1px solid var(--line)', marginTop: 8, paddingTop: 12 }}><span className="muted">Tạm tính</span><span>{fmt(o.subtotal)}</span></div>
        {o.discount ? <div className="sum-row"><span className="muted">Giảm giá {o.couponCode}</span><span>-{fmt(o.discount)}</span></div> : null}
        <div className="sum-row"><span className="muted">Vận chuyển</span><span>{o.shippingFee ? fmt(o.shippingFee) : 'Miễn phí'}</span></div>
        <div className="sum-row"><span className="muted">Thanh toán</span><span>{PAY_INFO[pm]?.name}{o.paidAmount ? ` · đã trả ${fmt(o.paidAmount)}` : ''}</span></div>
        <div className="sum-row"><span className="muted">Giao đến</span><span style={{ textAlign: 'right', maxWidth: '60%' }}>{o.shippingMethod === 'pickup' ? 'Nhận tại showroom' : [o.address, o.ward, o.province].filter(Boolean).join(', ')}</span></div>
        <div className="sum-row sum-row--total"><span>Tổng cộng</span><span>{fmt(o.total)}</span></div>
        <div className="timeline">{steps.map((st, i) => <div key={st} className={i < reached ? 'on' : ''}>{st}</div>)}</div>
      </div>
      <div className="hero__ctas" style={{ justifyContent: 'center' }}>
        <Link href="/san-pham" className="btn btn--primary">Tiếp tục mua sắm</Link>
        {s.hotline && <a href={`tel:${s.hotline.replace(/\s/g, '')}`} className="btn btn--outline">Gọi hotline {s.hotline}</a>}
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 24 }}>Lưu đường link trang này để theo dõi đơn, hoặc tra cứu bằng mã đơn + số điện thoại tại mục Tra cứu đơn hàng.</p>
    </div>
  )
}
