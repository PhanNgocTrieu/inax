// @vitest-environment node
import crypto from 'crypto'
import { beforeAll, describe, expect, it } from 'vitest'

beforeAll(() => {
  process.env.VNPAY_TMN_CODE = 'TESTCODE'
  process.env.VNPAY_HASH_SECRET = 'TESTSECRET'
  process.env.MOMO_PARTNER_CODE = 'MOMO'
  process.env.MOMO_ACCESS_KEY = 'ACCESS'
  process.env.MOMO_SECRET_KEY = 'SECRET'
  process.env.ZALOPAY_APP_ID = '2553'
  process.env.ZALOPAY_KEY1 = 'k1'
  process.env.ZALOPAY_KEY2 = 'k2'
})

describe('VNPAY', () => {
  it('ký URL và xác thực lại được, phát hiện dữ liệu bị sửa', async () => {
    const { vnpayUrl, vnpayVerify } = await import('@/lib/payments/vnpay')
    const url = new URL(vnpayUrl({ code: 'GH2611130001', amount: 1476960, info: 'Thanh toan don hang GH2611130001', ip: '127.0.0.1', returnUrl: 'http://localhost:3000/api/shop/vnpay/return' }))
    expect(url.searchParams.get('vnp_Amount')).toBe('147696000')
    // Giả lập VNPAY trả về: thêm mã phản hồi rồi ký lại bằng cùng thuật toán
    const q = new URLSearchParams(url.search)
    q.delete('vnp_SecureHash')
    q.set('vnp_ResponseCode', '00'); q.set('vnp_TransactionStatus', '00'); q.set('vnp_TransactionNo', '14000001')
    const sorted = [...q.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&')
    q.set('vnp_SecureHash', crypto.createHmac('sha512', 'TESTSECRET').update(sorted).digest('hex'))
    const ok = vnpayVerify(q)
    expect(ok).toMatchObject({ valid: true, code: 'GH2611130001', amount: 1476960, success: true, transactionId: '14000001' })
    q.set('vnp_Amount', '100')
    expect(vnpayVerify(q).valid).toBe(false)
  })
})

describe('MoMo', () => {
  it('xác thực chữ ký IPN', async () => {
    const { momoVerify } = await import('@/lib/payments/momo')
    const d: Record<string, string | number> = {
      partnerCode: 'MOMO', orderId: 'GH2611130002-1', requestId: 'GH2611130002-1', amount: 500000, orderInfo: 'x', orderType: 'momo_wallet',
      transId: 999, resultCode: 0, message: 'Successful.', payType: 'qr', responseTime: 1, extraData: Buffer.from(JSON.stringify({ code: 'GH2611130002' })).toString('base64'),
    }
    const raw = `accessKey=ACCESS&amount=${d.amount}&extraData=${d.extraData}&message=${d.message}&orderId=${d.orderId}&orderInfo=${d.orderInfo}&orderType=${d.orderType}&partnerCode=${d.partnerCode}&payType=${d.payType}&requestId=${d.requestId}&responseTime=${d.responseTime}&resultCode=${d.resultCode}&transId=${d.transId}`
    d.signature = crypto.createHmac('sha256', 'SECRET').update(raw).digest('hex')
    expect(momoVerify(d)).toMatchObject({ valid: true, code: 'GH2611130002', amount: 500000, success: true })
    expect(momoVerify({ ...d, amount: 1 }).valid).toBe(false)
  })
})

describe('ZaloPay', () => {
  it('xác thực callback', async () => {
    const { zalopayVerify } = await import('@/lib/payments/zalopay')
    const data = JSON.stringify({ app_trans_id: '261113_GH2611130003', amount: 200000, zp_trans_id: 77 })
    const mac = crypto.createHmac('sha256', 'k2').update(data).digest('hex')
    expect(zalopayVerify({ data, mac })).toMatchObject({ valid: true, code: 'GH2611130003', amount: 200000 })
    expect(zalopayVerify({ data, mac: 'x' }).valid).toBe(false)
  })
})
