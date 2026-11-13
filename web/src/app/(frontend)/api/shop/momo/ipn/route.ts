import { recordPayment } from '@/lib/shop'
import { momoVerify } from '@/lib/payments/momo'
import { getP } from '../../_util'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const v = momoVerify(body)
  if (!v.valid) return new Response('invalid signature', { status: 400 })
  await recordPayment(await getP(), v.code, { provider: 'momo', amount: v.amount, success: v.success, transactionId: v.transactionId, raw: body })
  return new Response(null, { status: 204 })
}
