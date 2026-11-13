'use client'
import { useState } from 'react'
import { bgImage, type TexSpec } from '@/lib/texture'
import { useShop } from './Providers'
import { Icon } from './Sprite'

export type QuoteCtx = { mode: 'quote' | 'sample' | 'visit'; product?: string; tex?: TexSpec | null; img?: string | null }
const DEFAULT_TEX: TexSpec = { t: 'terrazzo', base: '#ece6dc', chips: ['#c9b9a3', '#8f8476', '#d8cfc2', '#a7765a', '#fff'], seed: 4 }

export async function sendRequest(data: Record<string, unknown>) {
  const res = await fetch('/api/shop/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  const j = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(j.error || 'Gửi không thành công, vui lòng thử lại')
}

export function QuoteModal({ ctx, onClose }: { ctx: QuoteCtx; onClose: () => void }) {
  const { toast, lines } = useShop()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const { mode } = ctx
  const title = mode === 'sample' ? 'Đặt mẫu miễn phí' : mode === 'visit' ? 'Đặt lịch tham quan' : 'Nhận báo giá công trình'
  const desc = mode === 'sample' ? 'Nhận tối đa 5 mẫu vật liệu thật, giao tận nơi trong 48h.' : mode === 'visit' ? 'Chuyên viên sẽ đón tiếp và tư vấn riêng cho bạn.' : 'Báo giá chi tiết trong 24h – chiết khấu tốt cho nhà thầu.'
  const defaultProducts = ctx.product === '__cart' ? lines.map((l) => `${l.name} (${l.qty} ${l.unit})`).join('; ') : ctx.product || ''

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.checkValidity()) { f.reportValidity(); return }
    setBusy(true); setErr(null)
    try {
      await sendRequest({ type: mode, ...Object.fromEntries(new FormData(f)) })
      toast('Đã gửi! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.'); onClose()
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  return (
    <div className="modal is-open" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal__box">
        <div className="modal__side" style={{ backgroundImage: bgImage(ctx.img, ctx.tex || DEFAULT_TEX) }}>
          <p className="eyebrow eyebrow--light">GreenHabitat</p><h3>{title}</h3><p style={{ fontSize: 13, opacity: .85, marginTop: 8 }}>{desc}</p>
        </div>
        <form className="modal__main" onSubmit={submit} noValidate>
          <button type="button" className="icon-btn modal__close" onClick={onClose} aria-label="Đóng"><Icon name="close" className="" /></button>
          <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
          <div className="form-grid" style={{ marginTop: 12 }}>
            <label className="field">Họ và tên *<input name="name" required autoComplete="name" /></label>
            <label className="field">Số điện thoại *<input name="phone" type="tel" required pattern="0[0-9]{9}" autoComplete="tel" title="10 số, bắt đầu bằng 0" /></label>
            {mode === 'sample' && <>
              <label className="field full">Mẫu muốn nhận<input name="products" defaultValue={defaultProducts} placeholder="Tên sản phẩm" /></label>
              <label className="field full">Địa chỉ nhận mẫu *<input name="address" required autoComplete="street-address" /></label>
            </>}
            {mode === 'visit' && <>
              <label className="field">Ngày *<input type="date" name="visitDate" required /></label>
              <label className="field">Khung giờ<select name="timeline"><option>Sáng (8:00 – 11:30)</option><option>Chiều (13:30 – 17:00)</option></select></label>
            </>}
            {mode === 'quote' && <>
              <label className="field">Bạn là<select name="customerType"><option>Chủ nhà</option><option>Nhà thầu</option><option>Kiến trúc sư / Thiết kế</option><option>Chủ đầu tư dự án</option></select></label>
              <label className="field">Loại công trình<select name="projectType"><option>Nhà phố / Biệt thự</option><option>Căn hộ</option><option>Khách sạn / Resort</option><option>Văn phòng / Thương mại</option></select></label>
              <label className="field full">Sản phẩm quan tâm<input name="products" defaultValue={defaultProducts} placeholder="VD: Gạch 60×60, sàn gỗ sồi…" /></label>
              <label className="field">Diện tích dự kiến<div className="suffix"><input name="area" type="number" min="0" /><span>m²</span></div></label>
              <label className="field">Thời gian thi công<select name="timeline"><option>Trong 1 tháng</option><option>1 – 3 tháng</option><option>Trên 3 tháng</option></select></label>
              <label className="field full">Ghi chú / Link bản vẽ<textarea name="note" placeholder="Mô tả yêu cầu hoặc gửi link bản vẽ" /></label>
            </>}
          </div>
          {err && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{err}</p>}
          <button className="btn btn--primary btn--block" style={{ marginTop: 20 }} disabled={busy}>
            {busy ? 'Đang gửi…' : mode === 'sample' ? 'Gửi yêu cầu mẫu' : mode === 'visit' ? 'Xác nhận lịch hẹn' : 'Gửi yêu cầu báo giá'} <Icon name="arrow" />
          </button>
          <p className="muted" style={{ fontSize: 12, marginTop: 10, textAlign: 'center' }}>Thông tin của bạn được bảo mật theo chính sách quyền riêng tư.</p>
        </form>
      </div>
    </div>
  )
}

/** Nút mở popup báo giá – dùng được trong server component */
export function QuoteButton({ ctx, className = 'btn btn--outline', children }: { ctx: QuoteCtx; className?: string; children: React.ReactNode }) {
  const { openQuote } = useShop()
  return <button type="button" className={className} onClick={() => openQuote(ctx)}>{children}</button>
}
