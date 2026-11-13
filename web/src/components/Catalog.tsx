'use client'
import { useMemo, useState } from 'react'
import type { ProductView } from '@/lib/data'
import { COLORS, PRICE_RANGES, ROOMS } from '@/lib/constants'
import { ProductCard } from './ProductCard'
import { Icon } from './Sprite'

type F = { room: string; colors: string[]; prices: string[]; finishes: string[]; origins: string[] }
const toggle = (a: string[], v: string) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
const PAGE = 12

function Group({ id, title, closed, onToggle, children }: { id: string; title: string; closed: string[]; onToggle: (id: string) => void; children: React.ReactNode }) {
  return (
    <div className={`f-group ${closed.includes(id) ? 'is-closed' : ''}`}>
      <button onClick={() => onToggle(id)} aria-expanded={!closed.includes(id)}>{title} <Icon name="chev" /></button>
      <div className="f-body">{children}</div>
    </div>
  )
}
function Check({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={onChange} />{label}</label>
}

export function Catalog({ products, initialRoom = '' }: { products: ProductView[]; initialRoom?: string }) {
  const [f, setF] = useState<F>({ room: initialRoom, colors: [], prices: [], finishes: [], origins: [] })
  const [sort, setSort] = useState('featured')
  const [open, setOpen] = useState(false)
  const [closed, setClosed] = useState<string[]>(['origin'])
  const [page, setPage] = useState(1)
  const finishes = useMemo(() => [...new Set(products.flatMap((p) => p.finishes))], [products])
  const origins = useMemo(() => [...new Set(products.map((p) => p.origin).filter(Boolean))], [products])

  const list = useMemo(() => {
    const l = products.filter((p) =>
      (!f.room || p.rooms.includes(f.room)) && (!f.colors.length || f.colors.includes(p.color)) &&
      (!f.prices.length || f.prices.some((id) => { const r = PRICE_RANGES.find((x) => x.id === id)!; return p.price >= r.min && p.price < r.max })) &&
      (!f.finishes.length || p.finishes.some((x) => f.finishes.includes(x))) && (!f.origins.length || f.origins.includes(p.origin)))
    if (sort === 'price-asc') l.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') l.sort((a, b) => b.price - a.price)
    if (sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    return l
  }, [products, f, sort])
  const pages = Math.max(1, Math.ceil(list.length / PAGE))
  const shown = list.slice((page - 1) * PAGE, page * PAGE)
  const upd = (patch: Partial<F>) => { setF((x) => ({ ...x, ...patch })); setPage(1) }

  const chips: [string, string, () => void][] = [
    ...(f.room ? [[ROOMS.find((r) => r.id === f.room)?.name || f.room, 'room', () => upd({ room: '' })] as [string, string, () => void]] : []),
    ...f.colors.map((c) => [COLORS.find((x) => x.id === c)!.name, 'c' + c, () => upd({ colors: toggle(f.colors, c) })] as [string, string, () => void]),
    ...f.prices.map((c) => [PRICE_RANGES.find((x) => x.id === c)!.name, 'p' + c, () => upd({ prices: toggle(f.prices, c) })] as [string, string, () => void]),
    ...f.finishes.map((c) => [c, 'f' + c, () => upd({ finishes: toggle(f.finishes, c) })] as [string, string, () => void]),
    ...f.origins.map((c) => [c, 'o' + c, () => upd({ origins: toggle(f.origins, c) })] as [string, string, () => void]),
  ]
  return (
    <div className="catalog">
      <div className={`scrim ${open ? 'is-on' : ''}`} onClick={() => setOpen(false)} style={{ zIndex: 85 }} />
      <aside className={`filters ${open ? 'is-open' : ''}`}>
        <div className="filters__head"><h3>Bộ lọc</h3><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Đóng"><Icon name="close" className="" /></button></div>
        <Group closed={closed} onToggle={(x) => setClosed(toggle(closed, x))} id="room" title="Không gian">
          {ROOMS.map((r) => <label key={r.id} className="check"><input type="radio" name="room" checked={f.room === r.id} onChange={() => upd({ room: r.id })} />{r.name}</label>)}
        </Group>
        <Group closed={closed} onToggle={(x) => setClosed(toggle(closed, x))} id="color" title="Màu sắc">
          <div className="color-dots">{COLORS.map((c) => <button key={c.id} className={`color-dot ${f.colors.includes(c.id) ? 'is-active' : ''}`} title={c.name} aria-label={c.name} aria-pressed={f.colors.includes(c.id)} style={{ background: c.hex }} onClick={() => upd({ colors: toggle(f.colors, c.id) })} />)}</div>
        </Group>
        <Group closed={closed} onToggle={(x) => setClosed(toggle(closed, x))} id="price" title="Khoảng giá">{PRICE_RANGES.map((r) => <Check key={r.id} label={r.name} checked={f.prices.includes(r.id)} onChange={() => upd({ prices: toggle(f.prices, r.id) })} />)}</Group>
        <Group closed={closed} onToggle={(x) => setClosed(toggle(closed, x))} id="finish" title="Bề mặt">{finishes.map((x) => <Check key={x} label={x} checked={f.finishes.includes(x)} onChange={() => upd({ finishes: toggle(f.finishes, x) })} />)}</Group>
        <Group closed={closed} onToggle={(x) => setClosed(toggle(closed, x))} id="origin" title="Xuất xứ">{origins.map((x) => <Check key={x} label={x} checked={f.origins.includes(x)} onChange={() => upd({ origins: toggle(f.origins, x) })} />)}</Group>
        <div style={{ paddingTop: 20 }}><button className="btn btn--outline btn--sm btn--block" onClick={() => upd({ room: '', colors: [], prices: [], finishes: [], origins: [] })}>Xóa bộ lọc</button></div>
      </aside>
      <div>
        <div className="toolbar">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn--outline btn--sm filter-toggle" onClick={() => setOpen(true)}><Icon name="filter" /> Bộ lọc</button>
            <span className="muted">{list.length} sản phẩm</span>
          </div>
          <div className="toolbar__right">
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sắp xếp">
              <option value="featured">Nổi bật</option><option value="price-asc">Giá: thấp → cao</option>
              <option value="price-desc">Giá: cao → thấp</option><option value="name">Tên A–Z</option>
            </select>
          </div>
        </div>
        {chips.length > 0 && <div className="active-filters">{chips.map(([t, k, fn]) => <button key={k} className="af" onClick={fn}>{t} <Icon name="close" /></button>)}</div>}
        <div className="p-grid p-grid--3">
          {shown.length ? shown.map((p) => <ProductCard key={p.id} p={p} />) :
            <div className="empty" style={{ gridColumn: '1/-1' }}><h3>Không tìm thấy sản phẩm phù hợp</h3><p>Thử bỏ bớt bộ lọc hoặc liên hệ để được tư vấn mẫu tương tự.</p></div>}
        </div>
        {pages > 1 && <div className="pagination">{Array.from({ length: pages }, (_, i) => (
          <button key={i} className={page === i + 1 ? 'is-active' : ''} onClick={() => { setPage(i + 1); scrollTo({ top: 300, behavior: 'smooth' }) }}>{i + 1}</button>))}</div>}
      </div>
    </div>
  )
}
