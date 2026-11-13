import crypto from 'crypto'

/** Ví MoMo – One-time payment (captureWallet) – https://developers.momo.vn */
const cfg = () => ({
  partnerCode: process.env.MOMO_PARTNER_CODE || '',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
})
export const momoEnabled = () => Boolean(cfg().partnerCode && cfg().accessKey && cfg().secretKey)
const hmac = (s: string) => crypto.createHmac('sha256', cfg().secretKey).update(s).digest('hex')

export async function momoCreate(o: { code: string; amount: number; info: string; redirectUrl: string; ipnUrl: string }) {
  const c = cfg()
  const requestId = `${o.code}-${Date.now()}`
  const body = {
    partnerCode: c.partnerCode, accessKey: c.accessKey, requestId, amount: String(Math.round(o.amount)), orderId: requestId,
    orderInfo: o.info, redirectUrl: o.redirectUrl, ipnUrl: o.ipnUrl, extraData: Buffer.from(JSON.stringify({ code: o.code })).toString('base64'),
    requestType: 'captureWallet', lang: 'vi',
  }
  const raw = `accessKey=${body.accessKey}&amount=${body.amount}&extraData=${body.extraData}&ipnUrl=${body.ipnUrl}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&partnerCode=${body.partnerCode}&redirectUrl=${body.redirectUrl}&requestId=${body.requestId}&requestType=${body.requestType}`
  const res = await fetch(c.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, signature: hmac(raw) }) })
  const json = await res.json()
  if (json.resultCode !== 0 || !json.payUrl) throw new Error(`MoMo: ${json.message || 'không tạo được giao dịch'}`)
  return json.payUrl as string
}

/** Xác thực IPN / redirect của MoMo */
export function momoVerify(d: Record<string, string | number>) {
  const c = cfg()
  const raw = `accessKey=${c.accessKey}&amount=${d.amount}&extraData=${d.extraData}&message=${d.message}&orderId=${d.orderId}&orderInfo=${d.orderInfo}&orderType=${d.orderType}&partnerCode=${d.partnerCode}&payType=${d.payType}&requestId=${d.requestId}&responseTime=${d.responseTime}&resultCode=${d.resultCode}&transId=${d.transId}`
  let code = String(d.orderId || '').split('-')[0]
  try { code = JSON.parse(Buffer.from(String(d.extraData), 'base64').toString()).code || code } catch { /* ignore */ }
  return { valid: hmac(raw) === d.signature, code, amount: Number(d.amount), success: Number(d.resultCode) === 0, transactionId: String(d.transId) }
}
