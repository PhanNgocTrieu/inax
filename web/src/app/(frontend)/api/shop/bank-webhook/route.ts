import { recordPayment } from '@/lib/shop'
import { getP, json } from '../_util'

/**
 * Webhook biến động số dư (định dạng SePay – https://docs.sepay.vn/tich-hop-webhooks.html).
 * Khách chuyển khoản với nội dung = mã đơn (GHyymmddxxxx) → đơn tự chuyển "Đã thanh toán".
 */
export async function POST(req: Request) {
  const key = process.env.SEPAY_API_KEY
  if (!key || req.headers.get('authorization') !== `Apikey ${key}`) return json({ success: false }, 401)
  const b = await req.json().catch(() => ({}))
  if (b.transferType !== 'in') return json({ success: true })
  const code = String(b.content || '').toUpperCase().match(/GH\d{10}/)?.[0]
  if (!code) return json({ success: true, note: 'no order code' })
  await recordPayment(await getP(), code, { provider: 'bank', amount: Number(b.transferAmount), success: true, transactionId: String(b.id ?? b.referenceCode), raw: b })
  return json({ success: true })
}
