import { getP, json } from '../_util'

const TYPES = ['quote', 'sample', 'visit', 'contact', 'newsletter'] as const
const s = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined)

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  if (!b || !TYPES.includes(b.type)) return json({ error: 'Dữ liệu không hợp lệ' }, 400)
  if (b.website) return json({ ok: true }) // honeypot chống spam
  const phone = s(b.phone, 20)?.replace(/\s/g, '')
  if (b.type === 'newsletter') {
    if (!/^\S+@\S+\.\S+$/.test(s(b.email) || '')) return json({ error: 'Email không hợp lệ' }, 422)
  } else {
    if (!s(b.name)) return json({ error: 'Vui lòng nhập họ tên' }, 422)
    if (!/^0\d{9}$/.test(phone || '')) return json({ error: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' }, 422)
  }
  const payload = await getP()
  await payload.create({
    collection: 'requests', overrideAccess: true,
    data: {
      type: b.type, name: s(b.name) || s(b.email), phone, email: s(b.email), customerType: s(b.customerType), projectType: s(b.projectType),
      topic: s(b.topic), products: s(b.products, 500), area: Number(b.area) || undefined, timeline: s(b.timeline),
      visitDate: s(b.visitDate), address: s(b.address, 400), note: s(b.note, 3000),
    },
  })
  return json({ ok: true })
}
