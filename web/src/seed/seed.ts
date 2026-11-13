/**
 * Nạp dữ liệu mẫu (dùng chung cho `pnpm seed` và SEED_ON_INIT=1 khi khởi động)
 * Tạo danh mục, sản phẩm, dự án, mã giảm giá, cài đặt và tài khoản quản trị (từ SEED_ADMIN_* trong .env).
 * Chạy lại an toàn: bỏ qua bản ghi đã tồn tại (theo slug / code / email).
 */
import type { Payload } from 'payload'
import data from './data.json' with { type: 'json' }

const SPEC_BY_CAT: Record<string, { label: string; value: string }[]> = {
  'gach-op-lat': [{ label: 'Độ dày', value: '9 – 11 mm' }, { label: 'Độ hút nước', value: '< 0,5%' }, { label: 'Chống trơn', value: 'R10 / R11' }, { label: 'Bảo hành', value: '10 năm' }],
  'da-tu-nhien': [{ label: 'Độ dày', value: '18 – 20 mm' }, { label: 'Ứng dụng', value: 'Mặt bếp, ốp tường, lát sàn' }, { label: 'Xử lý bề mặt', value: 'Chống thấm nano' }, { label: 'Bảo hành', value: '15 năm' }],
  'san-go': [{ label: 'Hèm khóa', value: 'Unilin 2G' }, { label: 'Tiêu chuẩn', value: 'E0 / FloorScore' }, { label: 'Bảo hành', value: '25 năm' }],
  'thiet-bi-ve-sinh': [{ label: 'Chất liệu', value: 'Sứ cao cấp / đồng thau' }, { label: 'Men', value: 'Kháng khuẩn, chống bám bẩn' }, { label: 'Bảo hành', value: '5 năm' }],
  'tam-op': [{ label: 'Chất liệu', value: 'Composite / nano' }, { label: 'Chống ẩm, mối mọt', value: 'Có' }, { label: 'Bảo hành', value: '5 năm' }],
  'hoan-thien': [{ label: 'Định mức', value: '1,2 – 1,5 kg/m²/lớp' }, { label: 'Thời gian khô', value: '4 – 6 giờ' }, { label: 'Bảo hành', value: '5 năm' }],
}

async function upsert<T extends 'categories' | 'products' | 'projects' | 'coupons'>(payload: Payload, collection: T, field: string, value: string, doc: Record<string, unknown>) {
  const { docs } = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1, overrideAccess: true })
  if (docs[0]) return docs[0]
  return payload.create({ collection, data: doc as never, overrideAccess: true })
}

export async function seed(payload: Payload) {
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  const email = process.env.SEED_ADMIN_EMAIL, password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const { totalDocs } = await payload.count({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
    if (!totalDocs) { await payload.create({ collection: 'users', data: { email, password, name: 'Quản trị', role: 'admin' }, overrideAccess: true }); log(`admin ${email}`) }
  }

  await payload.updateGlobal({
    slug: 'settings', overrideAccess: true,
    data: { address: data.site.address, hours: data.site.hours, brands: data.brands, legalName: data.site.legalName },
  })

  const catIds: Record<string, number> = {}
  for (const [i, c] of data.categories.entries()) {
    const d = await upsert(payload, 'categories', 'slug', c.id, { name: c.name, slug: c.id, short: c.short, order: i, texture: c.tex })
    catIds[c.id] = d.id as number
  }
  log(`${data.categories.length} danh mục`)

  const prodIds: Record<string, number> = {}
  for (const p of data.products) {
    const d = await upsert(payload, 'products', 'slug', p.slug, {
      name: p.name, slug: p.slug, category: catIds[p.cat], sku: `GH-${p.id.toUpperCase()}`, origin: p.origin,
      price: p.price, oldPrice: (p as { oldPrice?: number }).oldPrice, unit: p.unit, boxM2: (p as { boxM2?: number }).boxM2, stock: 100,
      sizes: p.sizes, finishes: p.finishes, rooms: p.rooms, color: p.color, badges: p.badges, texture: p.tex,
      featured: p.badges.length > 0, published: true, specs: SPEC_BY_CAT[p.cat] || [],
    })
    prodIds[p.name] = d.id as number
  }
  log(`${data.products.length} sản phẩm`)

  for (const pr of data.projects) {
    await upsert(payload, 'projects', 'slug', pr.id, { name: pr.name, slug: pr.id, type: pr.type, year: pr.year, area: pr.area, materials: pr.materials, location: 'Đà Nẵng', texture: pr.tex })
  }
  log(`${data.projects.length} dự án`)

  await upsert(payload, 'coupons', 'code', 'GREEN5', { code: 'GREEN5', type: 'percent', value: 5, maxDiscount: 2000000, active: true })
  log('mã giảm giá GREEN5')
}
