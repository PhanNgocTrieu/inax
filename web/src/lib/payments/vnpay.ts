import crypto from 'crypto'

/** Tích hợp VNPAY v2.1.0 – https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html */
const cfg = () => ({
  tmnCode: process.env.VNPAY_TMN_CODE || '',
  secret: process.env.VNPAY_HASH_SECRET || '',
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
})
export const vnpayEnabled = () => Boolean(cfg().tmnCode && cfg().secret)

function vnTime(d: Date) {
  const t = new Date(d.getTime() + 7 * 3600e3).toISOString()
  return t.slice(0, 19).replace(/[-T:]/g, '')
}
function encode(params: Record<string, string>) {
  return Object.keys(params).sort().map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`).join('&')
}
function sign(data: string) {
  return crypto.createHmac('sha512', cfg().secret).update(Buffer.from(data, 'utf-8')).digest('hex')
}

export function vnpayUrl(o: { code: string; amount: number; info: string; ip: string; returnUrl: string; card?: boolean }) {
  const now = new Date()
  const params: Record<string, string> = {
    vnp_Version: '2.1.0', vnp_Command: 'pay', vnp_TmnCode: cfg().tmnCode, vnp_Locale: 'vn', vnp_CurrCode: 'VND',
    vnp_TxnRef: o.code, vnp_OrderInfo: o.info, vnp_OrderType: 'other', vnp_Amount: String(Math.round(o.amount) * 100),
    vnp_ReturnUrl: o.returnUrl, vnp_IpAddr: o.ip, vnp_CreateDate: vnTime(now), vnp_ExpireDate: vnTime(new Date(now.getTime() + 15 * 60e3)),
  }
  if (o.card) params.vnp_BankCode = 'INTCARD'
  const q = encode(params)
  return `${cfg().url}?${q}&vnp_SecureHash=${sign(q)}`
}

/** Kiểm tra chữ ký trên return URL / IPN */
export function vnpayVerify(search: URLSearchParams) {
  const params: Record<string, string> = {}
  search.forEach((v, k) => { if (k.startsWith('vnp_') && k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType') params[k] = v })
  const valid = sign(encode(params)) === (search.get('vnp_SecureHash') || '').toLowerCase()
  return {
    valid,
    code: params.vnp_TxnRef,
    amount: Number(params.vnp_Amount || 0) / 100,
    success: params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00',
    transactionId: params.vnp_TransactionNo,
    raw: params,
  }
}
