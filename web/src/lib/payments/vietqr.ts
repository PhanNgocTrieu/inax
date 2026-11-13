import type { Setting } from '@/payload-types'

/** Ảnh QR chuyển khoản chuẩn VietQR (napas) – dùng dịch vụ ảnh miễn phí của vietqr.io */
export function vietqrImage(s: Setting, amount: number, content: string) {
  if (!s.bankCode || !s.bankAccount) return null
  const q = new URLSearchParams({ amount: String(Math.round(amount)), addInfo: content, accountName: s.bankAccountName || '' })
  return `https://img.vietqr.io/image/${encodeURIComponent(s.bankCode)}-${encodeURIComponent(s.bankAccount)}-compact2.png?${q}`
}
