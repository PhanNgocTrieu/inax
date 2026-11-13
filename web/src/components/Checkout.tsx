'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { PAY_INFO, PROVINCES } from '@/lib/constants'
import { bgImage } from '@/lib/texture'
import { fmt, num } from './format'
import { useShop } from './Providers'
import { Icon } from './Sprite'

type Priced = { subtotal: number; discount: number; couponCode?: string; couponError?: string; shippingFee: number; total: number; amountDue: number; errors: string[] }
type Ship = 'dn' | 'tinh' | 'pickup'

function F({ name, label, children, full, hint, errs }: { name: string; label: string; children: React.ReactNode; full?: boolean; hint?: string; errs: Record<string, string> }) {
  return <label className={`field ${full ? 'full' : ''} ${errs[name] ? 'is-invalid' : ''}`}>{label}{hint && <span className="hint">{hint}</span>}{children}<span className="err">{errs[name]}</span></label>
}

export function Checkout() {
  const { lines, ready, settings: s, clear, toast } = useShop()
  const [ship, setShip] = useState<Ship>('dn')
  const enabled = s.enabledPayments || []
  const [pay, setPay] = useState<string>(enabled[0] || 'cod')
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState('')
  const [priced, setPriced] = useState<Priced | null>(null)
  const [vat, setVat] = useState(false)
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const apiLines = useMemo(() => lines.map((l) => ({ id: l.id, size: l.size, finish: l.finish, qty: l.qty })), [lines])

  useEffect(() => {
    if (!lines.length) return
    const ctrl = new AbortController()
    fetch('/api/shop/price', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal, body: JSON.stringify({ lines: apiLines, ship, pay, coupon: applied }) })
      .then((r) => r.json()).then((d: Priced) => { setPriced(d); if (applied && d.couponError) { toast(d.couponError); setApplied('') } }).catch(() => {})
    return () => ctrl.abort()
  }, [apiLines, ship, pay, applied, lines.length, toast])

  if (!ready) return <div className="container" style={{ minHeight: '50vh' }} />
  if (!lines.length) return (
    <div className="container empty" style={{ padding: '120px 20px' }}><h3>Giỏ hàng đang trống</h3>
      <p style={{ marginTop: 24 }}><Link className="btn btn--primary" href="/san-pham">Mua sắm ngay</Link></p></div>
  )

  const shipFee = (m: Ship) => m === 'pickup' ? 0 : m === 'tinh' ? s.provinceFee ?? 450000 : (priced?.subtotal ?? 0) >= (s.freeShipThreshold ?? 5000000) ? 0 : s.innerCityFee ?? 150000
  const codBlocked = (priced?.total ?? 0) > (s.codLimit ?? 20000000)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    const local: Record<string, string> = {}
    if (!fd.name?.trim()) local.name = 'Vui lòng nhập họ tên'
    if (!/^0\d{9}$/.test((fd.phone || '').replace(/\s/g, ''))) local.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0'
    if (ship !== 'pickup') {
      if (!fd.province) local.province = 'Chọn tỉnh / thành'
      if (!fd.ward?.trim()) local.ward = 'Nhập phường / xã'
      if (!fd.address?.trim()) local.address = 'Nhập địa chỉ giao hàng'
    }
    setErrs(local); setFormError(null)
    if (Object.keys(local).length) { document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    if (!fd.agree) { setFormError('Vui lòng đồng ý với chính sách mua hàng'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: apiLines, ship, pay, coupon: applied, customer: { ...fd, vat } }),
      })
      const j = await res.json()
      if (!res.ok) { setErrs(j.fieldErrors || {}); setFormError(j.error || 'Đặt hàng không thành công'); setBusy(false); return }
      clear()
      window.location.href = j.redirect
    } catch { setFormError('Mất kết nối, vui lòng thử lại'); setBusy(false) }
  }

  return (
    <div className="container checkout">
      <form id="coForm" onSubmit={submit} noValidate>
        <div className="co-block"><h3>1. Thông tin người nhận</h3>
          <div className="form-grid">
            <F errs={errs} name="name" label="Họ và tên *"><input name="name" autoComplete="name" /></F>
            <F errs={errs} name="phone" label="Số điện thoại *"><input name="phone" type="tel" autoComplete="tel" inputMode="tel" /></F>
            <F errs={errs} name="email" label="Email" full hint="Nhận xác nhận đơn hàng & hóa đơn"><input name="email" type="email" autoComplete="email" /></F>
            {ship !== 'pickup' && <>
              <F errs={errs} name="province" label="Tỉnh / Thành phố *"><select name="province" defaultValue=""><option value="">Chọn tỉnh / thành</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select></F>
              <F errs={errs} name="ward" label="Phường / Xã *"><input name="ward" /></F>
              <F errs={errs} name="address" label="Địa chỉ cụ thể *" full><input name="address" placeholder="Số nhà, tên đường, tên công trình…" autoComplete="street-address" /></F>
            </>}
            <F errs={errs} name="note" label="Ghi chú giao hàng" full><textarea name="note" placeholder="VD: Giao giờ hành chính, cần xe nhỏ vào hẻm, gọi trước 30 phút…" style={{ minHeight: 80 }} /></F>
            <label className="check full"><input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} /> Xuất hóa đơn VAT cho công ty</label>
            {vat && <div className="full form-grid">
              <label className="field">Tên công ty<input name="company" /></label><label className="field">Mã số thuế<input name="taxCode" /></label>
              <label className="field full">Địa chỉ xuất hóa đơn<input name="taxAddress" /></label>
            </div>}
          </div>
        </div>
        <div className="co-block"><h3>2. Phương thức giao hàng</h3>
          <div className="radio-cards">
            {([['dn', 'Giao nội thành Đà Nẵng', 'Trong 24h · Miễn phí từ ' + fmt(s.freeShipThreshold ?? 5000000)], ['tinh', 'Giao tỉnh / thành khác', '2 – 5 ngày qua đối tác vận tải'], ['pickup', 'Nhận tại showroom', s.address || '']] as [Ship, string, string][]).map(([v, n, d]) => (
              <label key={v} className="rc"><input type="radio" name="ship" checked={ship === v} onChange={() => setShip(v)} /><div><b>{n}</b><span>{d}</span></div>
                <span className="price-tag">{shipFee(v) ? fmt(shipFee(v)) : 'Miễn phí'}</span></label>))}
          </div>
        </div>
        <div className="co-block"><h3>3. Phương thức thanh toán</h3>
          <div className="radio-cards">
            {enabled.map((m) => {
              const info = PAY_INFO[m]; const disabled = m === 'cod' && codBlocked
              return (
                <div key={m}>
                  <label className="rc" style={disabled ? { opacity: .5 } : undefined}>
                    <input type="radio" name="pay" checked={pay === m} disabled={disabled} onChange={() => setPay(m)} />
                    <div><b>{m === 'deposit' ? `${info.name} ${s.depositPercent ?? 30}%` : info.name}</b><span>{disabled ? `Chỉ áp dụng cho đơn dưới ${fmt(s.codLimit ?? 20000000)}` : info.desc}</span></div>
                    <span className="logo-pill" style={{ background: info.color }}>{info.logo}</span>
                  </label>
                  {pay === m && m === 'card' && <div className="pay-extra is-on">Bạn sẽ được chuyển đến cổng thanh toán (3-D Secure). GreenHabitat không lưu thông tin thẻ.</div>}
                  {pay === m && m === 'bank' && <div className="pay-extra is-on">Mã QR & thông tin chuyển khoản hiển thị sau khi đặt hàng. Đơn được xác nhận tự động khi nhận được tiền.</div>}
                  {pay === m && m === 'deposit' && priced && <div className="pay-extra is-on">Số tiền cọc: <b>{fmt(priced.amountDue)}</b> – chuyển khoản qua VietQR sau khi đặt hàng.</div>}
                </div>
              )
            })}
          </div>
        </div>
        <label className="check" style={{ margin: '8px 0 0' }}><input type="checkbox" name="agree" /> Tôi đồng ý với&nbsp;<Link href="/chinh-sach" style={{ textDecoration: 'underline' }} target="_blank">chính sách mua hàng & đổi trả</Link></label>
      </form>

      <aside className="summary">
        <h3>Đơn hàng của bạn</h3>
        <div className="mini-items">{lines.map((l) => (
          <div key={l.key} className="mini-item"><span className="t" style={{ backgroundImage: bgImage(l.img, l.tex) }}><i>{num(l.qty)}</i></span>
            <div>{l.name}<small>{[l.size, l.finish].filter(Boolean).join(' · ')}</small></div><b>{fmt(l.price * l.qty)}</b></div>))}
        </div>
        <div className="coupon">
          <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Mã giảm giá" aria-label="Mã giảm giá" />
          <button type="button" className="btn btn--outline btn--sm" onClick={() => { if (coupon.trim()) setApplied(coupon.trim().toUpperCase()) }}>Áp dụng</button>
        </div>
        <div className="sum-row"><span>Tạm tính</span><span>{priced ? fmt(priced.subtotal) : '…'}</span></div>
        {priced?.discount ? <div className="sum-row" style={{ color: 'var(--ok)' }}><span>Giảm giá ({priced.couponCode})</span><span>-{fmt(priced.discount)}</span></div> : null}
        <div className="sum-row"><span>Vận chuyển</span><span>{priced ? (priced.shippingFee ? fmt(priced.shippingFee) : 'Miễn phí') : '…'}</span></div>
        <div className="sum-row sum-row--total"><span>Tổng cộng</span><span>{priced ? fmt(priced.total) : '…'}</span></div>
        {pay === 'deposit' && priced && <div className="sum-row"><span>Thanh toán trước (cọc)</span><b>{fmt(priced.amountDue)}</b></div>}
        <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>Đã bao gồm VAT</p>
        {(formError || priced?.errors?.[0]) && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{formError || priced?.errors?.[0]}</p>}
        <button className="btn btn--primary btn--block" style={{ marginTop: 20 }} form="coForm" disabled={busy || !priced || Boolean(priced.errors?.length)}>
          <Icon name="lock" /> {busy ? 'Đang xử lý…' : 'Đặt hàng & thanh toán'}
        </button>
        <div className="secure"><Icon name="lock" /> Thanh toán bảo mật SSL · Cổng thanh toán được cấp phép</div>
      </aside>
    </div>
  )
}
