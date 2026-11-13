import { recordPayment } from '@/lib/shop'
import { vnpayVerify } from '@/lib/payments/vnpay'
import { getP } from '../../_util'

/** IPN: VNPAY gọi server-to-server – đây là nguồn xác nhận thanh toán chính thức */
export async function GET(req: Request) {
  const v = vnpayVerify(new URL(req.url).searchParams)
  if (!v.valid) return Response.json({ RspCode: '97', Message: 'Invalid signature' })
  const payload = await getP()
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: v.code } }, limit: 1, overrideAccess: true })
  const o = docs[0]
  if (!o) return Response.json({ RspCode: '01', Message: 'Order not found' })
  if (v.amount !== (o.amountDue || o.total)) return Response.json({ RspCode: '04', Message: 'Invalid amount' })
  const r = await recordPayment(payload, v.code, { provider: 'vnpay', amount: v.amount, success: v.success, transactionId: v.transactionId, raw: v.raw })
  if (r.status === 'duplicate') return Response.json({ RspCode: '02', Message: 'Order already confirmed' })
  return Response.json({ RspCode: '00', Message: 'Confirm Success' })
}
