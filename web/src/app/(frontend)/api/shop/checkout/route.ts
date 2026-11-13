import crypto from 'crypto'
import { clientIp, newOrderCode, ONLINE_GATEWAYS, priceCart, siteUrl, type PayMethod } from '@/lib/shop'
import { vnpayEnabled, vnpayUrl } from '@/lib/payments/vnpay'
import { momoCreate, momoEnabled } from '@/lib/payments/momo'
import { zalopayCreate, zalopayEnabled } from '@/lib/payments/zalopay'
import { getP, json, mockAllowed, orderUrl } from '../_util'

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  if (!b) return json({ error: 'Dữ liệu không hợp lệ' }, 400)
  const c = b.customer || {}
  const pay = str(b.pay) as PayMethod
  const ship = (['dn', 'tinh', 'pickup'].includes(b.ship) ? b.ship : 'dn') as 'dn' | 'tinh' | 'pickup'
  const fieldErrors: Record<string, string> = {}
  if (!str(c.name)) fieldErrors.name = 'Vui lòng nhập họ tên'
  if (!/^0\d{9}$/.test(str(c.phone).replace(/\s/g, ''))) fieldErrors.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0'
  if (c.email && !/^\S+@\S+\.\S+$/.test(str(c.email))) fieldErrors.email = 'Email không hợp lệ'
  if (ship !== 'pickup') {
    if (!str(c.province)) fieldErrors.province = 'Chọn tỉnh / thành'
    if (!str(c.ward)) fieldErrors.ward = 'Nhập phường / xã'
    if (!str(c.address)) fieldErrors.address = 'Nhập địa chỉ giao hàng'
  }
  if (Object.keys(fieldErrors).length) return json({ error: 'Vui lòng kiểm tra lại thông tin', fieldErrors }, 422)

  const payload = await getP()
  const r = await priceCart(payload, Array.isArray(b.lines) ? b.lines.slice(0, 100) : [], { ship, coupon: str(b.coupon), pay })
  if (!r.items.length) return json({ error: 'Giỏ hàng trống' }, 422)
  if (r.errors.length) return json({ error: r.errors[0] }, 422)

  const code = await newOrderCode(payload)
  const accessToken = crypto.randomBytes(12).toString('hex')
  const order = await payload.create({
    collection: 'orders', overrideAccess: true,
    data: {
      code, accessToken, status: pay === 'cod' ? 'pending_confirm' : 'pending_payment', paymentMethod: pay, shippingMethod: ship,
      customerName: str(c.name), customerPhone: str(c.phone).replace(/\s/g, ''), customerEmail: str(c.email) || undefined,
      province: str(c.province), ward: str(c.ward), address: str(c.address, 400), note: str(c.note, 1000),
      vat: { enabled: Boolean(c.vat), company: str(c.company), taxCode: str(c.taxCode, 20), address: str(c.taxAddress, 400) },
      items: r.items, subtotal: r.subtotal, discount: r.discount, couponCode: r.couponCode, shippingFee: r.shippingFee,
      total: r.total, amountDue: r.amountDue, paidAmount: 0,
    },
  })
  if (r.couponId) {
    const cp = await payload.findByID({ collection: 'coupons', id: r.couponId, overrideAccess: true })
    await payload.update({ collection: 'coupons', id: r.couponId, overrideAccess: true, data: { usedCount: (cp.usedCount || 0) + 1 } })
  }

  const base = siteUrl(req)
  const done = orderUrl(base, code, accessToken)
  const info = `Thanh toan don hang ${code}`
  try {
    if (ONLINE_GATEWAYS.includes(pay)) {
      if ((pay === 'vnpay' || pay === 'card') && vnpayEnabled())
        return json({ code, redirect: vnpayUrl({ code, amount: order.amountDue || order.total, info, ip: clientIp(req), returnUrl: `${base}/api/shop/vnpay/return`, card: pay === 'card' }) })
      if (pay === 'momo' && momoEnabled())
        return json({ code, redirect: await momoCreate({ code, amount: order.total, info, redirectUrl: `${base}/api/shop/momo/return`, ipnUrl: `${base}/api/shop/momo/ipn` }) })
      if (pay === 'zalopay' && zalopayEnabled())
        return json({ code, redirect: await zalopayCreate({ code, amount: order.total, info, redirectUrl: done, callbackUrl: `${base}/api/shop/zalopay/callback` }) })
      if (mockAllowed()) return json({ code, redirect: `${base}/thanh-toan/mo-phong?code=${code}&t=${accessToken}&provider=${pay}` })
      return json({ error: 'Cổng thanh toán đang bảo trì, vui lòng chọn phương thức khác' }, 503)
    }
  } catch (e) {
    payload.logger.error(e)
    return json({ error: 'Không kết nối được cổng thanh toán, vui lòng thử lại hoặc chọn phương thức khác', code }, 502)
  }
  return json({ code, redirect: done })
}
