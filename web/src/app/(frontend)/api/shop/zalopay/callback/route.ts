import { recordPayment } from '@/lib/shop'
import { zalopayVerify } from '@/lib/payments/zalopay'
import { getP } from '../../_util'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  try {
    const v = zalopayVerify(body)
    if (!v.valid) return Response.json({ return_code: -1, return_message: 'mac not equal' })
    await recordPayment(await getP(), v.code, { provider: 'zalopay', amount: v.amount, success: true, transactionId: v.transactionId, raw: body })
    return Response.json({ return_code: 1, return_message: 'success' })
  } catch {
    return Response.json({ return_code: 0, return_message: 'error' })
  }
}
