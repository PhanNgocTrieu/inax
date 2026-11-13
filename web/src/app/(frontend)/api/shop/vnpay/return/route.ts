import { recordPayment, siteUrl } from '@/lib/shop'
import { vnpayVerify } from '@/lib/payments/vnpay'
import { getP, orderUrl } from '../../_util'

export async function GET(req: Request) {
  const v = vnpayVerify(new URL(req.url).searchParams)
  const payload = await getP()
  const base = siteUrl(req)
  if (!v.valid) return Response.redirect(`${base}/dat-hang/loi?reason=signature`)
  const r = await recordPayment(payload, v.code, { provider: 'vnpay', amount: v.amount, success: v.success, transactionId: v.transactionId, raw: v.raw })
  return Response.redirect(r.order ? orderUrl(base, v.code, r.order.accessToken) : `${base}/dat-hang/loi`)
}
