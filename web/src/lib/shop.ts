import type { Payload } from 'payload'
import type { Order, Product, Setting } from '@/payload-types'

export type CartLine = { id: number | string; size?: string; finish?: string; qty: number }
export type ShipMethod = 'dn' | 'tinh' | 'pickup'
export type PayMethod = 'vnpay' | 'momo' | 'zalopay' | 'card' | 'bank' | 'deposit' | 'cod'
export const ONLINE_GATEWAYS: PayMethod[] = ['vnpay', 'momo', 'zalopay', 'card']

export async function getSettings(payload: Payload): Promise<Setting> {
  return payload.findGlobal({ slug: 'settings', depth: 0 })
}

export function shippingFee(s: Setting, method: ShipMethod, subtotal: number) {
  if (method === 'pickup') return 0
  if (method === 'tinh') return s.provinceFee ?? 450000
  return subtotal >= (s.freeShipThreshold ?? 5000000) ? 0 : s.innerCityFee ?? 150000
}

/** Tính lại toàn bộ đơn hàng phía server – không bao giờ tin giá từ trình duyệt */
export async function priceCart(
  payload: Payload,
  lines: CartLine[],
  opts: { ship?: ShipMethod; coupon?: string; pay?: PayMethod } = {},
) {
  const settings = await getSettings(payload)
  const ids = [...new Set(lines.map((l) => Number(l.id)))]
  const { docs } = await payload.find({
    collection: 'products', where: { id: { in: ids }, published: { equals: true } }, limit: ids.length, depth: 0,
  })
  const byId = new Map(docs.map((p) => [p.id, p as Product]))
  const errors: string[] = []
  const items = lines.flatMap((l) => {
    const p = byId.get(Number(l.id))
    const qty = Math.round(Number(l.qty) * 100) / 100
    if (!p) { errors.push('Một sản phẩm trong giỏ không còn được bán.'); return [] }
    if (!(qty > 0) || qty > 100000) { errors.push(`Số lượng không hợp lệ: ${p.name}`); return [] }
    const size = p.sizes?.includes(l.size || '') ? l.size : p.sizes?.[0] || undefined
    const finish = p.finishes?.includes(l.finish || '') ? l.finish : p.finishes?.[0] || undefined
    return [{ product: p.id, name: p.name, size, finish, unit: p.unit, unitPrice: p.price, qty, lineTotal: Math.round(p.price * qty) }]
  })
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)

  let discount = 0, couponCode: string | undefined, couponId: number | undefined, couponError: string | undefined
  if (opts.coupon) {
    const code = opts.coupon.trim().toUpperCase()
    const { docs: cs } = await payload.find({ collection: 'coupons', where: { code: { equals: code } }, limit: 1, depth: 0, overrideAccess: true })
    const c = cs[0]
    const expired = c?.expiresAt && new Date(c.expiresAt) < new Date()
    const used = c?.usageLimit && (c.usedCount ?? 0) >= c.usageLimit
    if (!c || !c.active || expired || used) couponError = 'Mã giảm giá không hợp lệ hoặc đã hết hạn'
    else if (subtotal < (c.minSubtotal ?? 0)) couponError = `Mã áp dụng cho đơn từ ${fmt(c.minSubtotal ?? 0)}`
    else {
      discount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value
      if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount)
      discount = Math.min(discount, subtotal)
      couponCode = c.code; couponId = c.id
    }
  }

  const ship = opts.ship || 'dn'
  const fee = shippingFee(settings, ship, subtotal)
  const total = subtotal - discount + fee
  const amountDue = opts.pay === 'deposit' ? Math.round((total * (settings.depositPercent ?? 30)) / 100) : total
  if (opts.pay === 'cod' && total > (settings.codLimit ?? 20000000)) errors.push(`COD chỉ áp dụng cho đơn dưới ${fmt(settings.codLimit ?? 20000000)}`)
  if (opts.pay && !(settings.enabledPayments || []).includes(opts.pay)) errors.push('Phương thức thanh toán chưa được hỗ trợ')

  return { settings, items, subtotal, discount, couponCode, couponId, couponError, shippingFee: fee, total, amountDue, errors }
}

export const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫'

export async function newOrderCode(payload: Payload) {
  const d = new Date(Date.now() + 7 * 3600e3) // giờ Việt Nam
  const day = d.toISOString().slice(2, 10).replace(/-/g, '')
  for (let i = 0; i < 10; i++) {
    const code = `GH${day}${Math.floor(1000 + Math.random() * 9000)}`
    const { totalDocs } = await payload.count({ collection: 'orders', where: { code: { equals: code } }, overrideAccess: true })
    if (!totalDocs) return code
  }
  throw new Error('Không tạo được mã đơn')
}

/**
 * Ghi nhận kết quả thanh toán (idempotent theo transactionId).
 * Dùng chung cho VNPAY / MoMo / ZaloPay / webhook ngân hàng / mô phỏng.
 */
export async function recordPayment(
  payload: Payload,
  code: string,
  p: { provider: string; amount: number; success: boolean; transactionId?: string; raw?: unknown },
): Promise<{ order?: Order; status: 'ok' | 'not_found' | 'duplicate' | 'amount_mismatch' }> {
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: code } }, limit: 1, overrideAccess: true, depth: 0 })
  const order = docs[0]
  if (!order) return { status: 'not_found' }
  const history = order.payments || []
  if (p.transactionId && history.some((h) => h.transactionId === p.transactionId && h.provider === p.provider)) {
    return { order, status: 'duplicate' }
  }
  const paidAmount = (order.paidAmount || 0) + (p.success ? p.amount : 0)
  let status = order.status
  if (p.success) {
    if (paidAmount >= order.total) status = 'paid'
    else if (paidAmount >= (order.amountDue || order.total)) status = 'deposit_paid'
  } else if (order.status === 'pending_payment' && !paidAmount) status = 'failed'
  const updated = await payload.update({
    collection: 'orders', id: order.id, overrideAccess: true,
    data: {
      status, paidAmount,
      payments: [...history, {
        provider: p.provider, amount: p.amount, status: p.success ? 'success' : 'failed',
        transactionId: p.transactionId, at: new Date().toISOString(), raw: (p.raw ?? null) as never,
      }],
    },
  })
  const mismatch = p.success && order.amountDue && p.amount < order.amountDue && paidAmount < order.total
  return { order: updated, status: mismatch ? 'amount_mismatch' : 'ok' }
}

export function siteUrl(req?: Request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (req) { const u = new URL(req.url); return u.origin }
  return 'http://localhost:3000'
}
export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '127.0.0.1'
}
