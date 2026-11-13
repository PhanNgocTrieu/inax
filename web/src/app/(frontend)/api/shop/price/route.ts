import { priceCart } from '@/lib/shop'
import { getP, json } from '../_util'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const payload = await getP()
  const r = await priceCart(payload, Array.isArray(body.lines) ? body.lines : [], { ship: body.ship, coupon: body.coupon, pay: body.pay })
  return json({
    items: r.items, subtotal: r.subtotal, discount: r.discount, couponCode: r.couponCode, couponError: r.couponError,
    shippingFee: r.shippingFee, total: r.total, amountDue: r.amountDue, errors: r.errors,
  })
}
