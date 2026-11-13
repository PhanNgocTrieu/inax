'use client'
import { useState } from 'react'
import { sendRequest } from './QuoteModal'
import { useShop } from './Providers'
import { Icon } from './Sprite'

export function NewsletterForm() {
  const { toast } = useShop()
  return (
    <form className="newsletter" onSubmit={async (e) => {
      e.preventDefault(); const f = e.currentTarget
      try { await sendRequest({ type: 'newsletter', email: new FormData(f).get('email') }); toast('Cảm ơn bạn đã đăng ký!'); f.reset() }
      catch (err) { toast((err as Error).message) }
    }}>
      <input type="email" name="email" required placeholder="Email của bạn" aria-label="Email" />
      <button className="btn btn--light">Đăng ký</button>
    </form>
  )
}

export function ContactForm() {
  const { toast } = useShop()
  const [busy, setBusy] = useState(false)
  return (
    <form className="contact__card" noValidate onSubmit={async (e) => {
      e.preventDefault(); const f = e.currentTarget
      if (!f.checkValidity()) { f.reportValidity(); return }
      setBusy(true)
      try { await sendRequest({ type: 'contact', ...Object.fromEntries(new FormData(f)) }); toast('Đã gửi! Chúng tôi sẽ phản hồi sớm.'); f.reset() }
      catch (err) { toast((err as Error).message) } finally { setBusy(false) }
    }}>
      <h3 className="display h3" style={{ marginBottom: 20 }}>Gửi tin nhắn</h3>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="form-grid">
        <label className="field">Họ và tên *<input name="name" required /></label>
        <label className="field">Số điện thoại *<input name="phone" type="tel" required pattern="0[0-9]{9}" title="10 số, bắt đầu bằng 0" /></label>
        <label className="field full">Email<input name="email" type="email" /></label>
        <label className="field full">Bạn cần hỗ trợ về<select name="topic"><option>Tư vấn chọn vật liệu</option><option>Báo giá công trình</option><option>Đặt lịch tham quan showroom</option><option>Hợp tác đại lý / nhà thầu</option><option>Bảo hành – đổi trả</option></select></label>
        <label className="field full">Nội dung<textarea name="note" /></label>
      </div>
      <button className="btn btn--primary btn--block" style={{ marginTop: 20 }} disabled={busy}>{busy ? 'Đang gửi…' : 'Gửi yêu cầu'} <Icon name="arrow" /></button>
    </form>
  )
}
