import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { fmt } from '@/components/format'
import { MockGateway } from '@/components/OrderClient'
import { PAY_INFO } from '@/lib/constants'

export const metadata = { title: 'Cổng thanh toán (mô phỏng)', robots: { index: false } }

export default async function MockPage({ searchParams }: { searchParams: Promise<{ code?: string; t?: string; provider?: string }> }) {
  const { code = '', t = '', provider = 'vnpay' } = await searchParams
  if (process.env.NODE_ENV === 'production' && process.env.PAYMENT_MOCK !== '1') notFound()
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'orders', where: { code: { equals: code } }, limit: 1, overrideAccess: true })
  const o = docs[0]
  if (!o || o.accessToken !== t) notFound()
  const info = PAY_INFO[provider] || PAY_INFO.vnpay
  return (
    <div className="container success">
      <span className="logo-pill" style={{ background: info.color, color: '#fff', fontWeight: 800, padding: '8px 14px', borderRadius: 6, display: 'inline-block' }}>{info.logo}</span>
      <h1 className="display h2" style={{ margin: '20px 0 8px' }}>Cổng thanh toán mô phỏng</h1>
      <p className="lead" style={{ margin: '0 auto' }}>Đơn {o.code} · Số tiền <b>{fmt(o.amountDue || o.total)}</b></p>
      <p className="muted" style={{ fontSize: 13, margin: '12px 0 32px' }}>Trang này chỉ xuất hiện khi chưa cấu hình khóa API của {info.name}. Khi có khóa thật, khách sẽ được chuyển thẳng sang cổng thanh toán.</p>
      <MockGateway code={o.code} t={t} provider={provider} amount={fmt(o.amountDue || o.total)} />
    </div>
  )
}
