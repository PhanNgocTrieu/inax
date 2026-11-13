import { recordPayment, siteUrl } from '@/lib/shop'
import { getP, json, mockAllowed, orderUrl } from '../_util'

/** Chỉ dùng khi chưa cấu hình khóa cổng thanh toán (môi trường dev / demo) */
export async function POST(req: Request) {
  if (!mockAllowed()) return json({ error: 'Not found' }, 404)
  const { code, t, success, provider } = await req.json()
  const payload = await getP()
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: code } }, limit: 1, overrideAccess: true })
  const o = docs[0]
  if (!o || o.accessToken !== t) return json({ error: 'Không tìm thấy đơn' }, 404)
  await recordPayment(payload, code, { provider: `mock-${provider}`, amount: o.amountDue || o.total, success: Boolean(success), transactionId: `MOCK${Date.now()}` })
  return json({ redirect: orderUrl(siteUrl(req), code, t) })
}
