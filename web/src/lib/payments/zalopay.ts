import crypto from 'crypto'

/** ZaloPay – https://docs.zalopay.vn/v2/general/overview.html */
const cfg = () => ({
  appId: process.env.ZALOPAY_APP_ID || '',
  key1: process.env.ZALOPAY_KEY1 || '',
  key2: process.env.ZALOPAY_KEY2 || '',
  endpoint: process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create',
})
export const zalopayEnabled = () => Boolean(cfg().appId && cfg().key1 && cfg().key2)
const mac = (key: string, s: string) => crypto.createHmac('sha256', key).update(s).digest('hex')

export async function zalopayCreate(o: { code: string; amount: number; info: string; redirectUrl: string; callbackUrl: string }) {
  const c = cfg()
  const d = new Date(Date.now() + 7 * 3600e3).toISOString().slice(2, 10).replace(/-/g, '')
  const params = {
    app_id: Number(c.appId), app_user: 'greenhabitat', app_time: Date.now(), amount: Math.round(o.amount),
    app_trans_id: `${d}_${o.code}`, item: '[]', embed_data: JSON.stringify({ redirecturl: o.redirectUrl, code: o.code }),
    description: o.info, bank_code: '', callback_url: o.callbackUrl,
  }
  const m = mac(c.key1, [params.app_id, params.app_trans_id, params.app_user, params.amount, params.app_time, params.embed_data, params.item].join('|'))
  const res = await fetch(c.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...params, mac: m }) })
  const json = await res.json()
  if (json.return_code !== 1) throw new Error(`ZaloPay: ${json.return_message || 'không tạo được giao dịch'}`)
  return json.order_url as string
}

/** Callback ZaloPay: { data, mac } – mac = HMAC(key2, data) */
export function zalopayVerify(body: { data: string; mac: string }) {
  const valid = mac(cfg().key2, body.data) === body.mac
  const data = JSON.parse(body.data || '{}')
  const code = String(data.app_trans_id || '').split('_')[1]
  return { valid, code, amount: Number(data.amount), success: true, transactionId: String(data.zp_trans_id) }
}
