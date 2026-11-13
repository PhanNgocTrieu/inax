import { recordPayment, siteUrl } from '@/lib/shop'
import { momoVerify } from '@/lib/payments/momo'
import { getP, orderUrl } from '../../_util'

export async function GET(req: Request) {
  const q = Object.fromEntries(new URL(req.url).searchParams)
  const v = momoVerify(q)
  const base = siteUrl(req)
  if (!v.valid) return Response.redirect(`${base}/dat-hang/loi?reason=signature`)
  const payload = await getP()
  const r = await recordPayment(payload, v.code, { provider: 'momo', amount: v.amount, success: v.success, transactionId: v.transactionId, raw: q })
  return Response.redirect(r.order ? orderUrl(base, v.code, r.order.accessToken) : `${base}/dat-hang/loi`)
}
