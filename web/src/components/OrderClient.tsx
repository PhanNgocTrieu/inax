'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/** Tự làm mới trang đơn hàng khi đang chờ chuyển khoản (webhook ngân hàng cập nhật trạng thái) */
export function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => router.refresh(), 8000)
    return () => clearInterval(t)
  }, [active, router])
  return null
}

export function MockGateway({ code, t, provider, amount }: { code: string; t: string; provider: string; amount: string }) {
  const [busy, setBusy] = useState(false)
  const go = async (success: boolean) => {
    setBusy(true)
    const r = await fetch('/api/shop/mock-pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, t, success, provider }) }).then((x) => x.json())
    window.location.href = r.redirect || '/'
  }
  return (
    <div className="hero__ctas" style={{ justifyContent: 'center' }}>
      <button className="btn btn--primary" disabled={busy} onClick={() => go(true)}>Thanh toán thành công {amount}</button>
      <button className="btn btn--outline" disabled={busy} onClick={() => go(false)}>Giả lập thất bại</button>
    </div>
  )
}
