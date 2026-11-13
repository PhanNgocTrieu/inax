'use client'
import { useState } from 'react'
import type { ProductView } from '@/lib/data'
import { texture } from '@/lib/texture'
import { fmt, num } from './format'
import { toAdd } from './ProductCard'
import { useShop } from './Providers'
import { Icon } from './Sprite'

export function Gallery({ p }: { p: ProductView }) {
  const t = texture(p.tex)
  const views: { label: string; style: React.CSSProperties }[] = p.images.length
    ? p.images.map((u, i) => ({ label: `Ảnh ${i + 1}`, style: { backgroundImage: `url('${u}')` } }))
    : [
      { label: 'Bề mặt', style: { backgroundImage: t } },
      { label: 'Chi tiết', style: { backgroundImage: t, backgroundSize: '220%', backgroundPosition: '30% 40%' } },
      { label: 'Cận cảnh', style: { backgroundImage: t, backgroundSize: '420%', backgroundPosition: '70% 60%' } },
      ...(p.tex?.t !== 'illus' ? [{ label: 'Phối cảnh', style: { backgroundImage: `linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.25)),${t}`, backgroundSize: 'cover,70px' } }] : []),
    ]
  const [i, setI] = useState(0)
  const [zoom, setZoom] = useState(false)
  return (
    <div className="gallery">
      <div className="gallery__thumbs">
        {views.map((v, k) => <button key={k} className={k === i ? 'is-active' : ''} style={v.style} onClick={() => setI(k)} aria-label={v.label} />)}
      </div>
      <div className="gallery__main" style={{ ...views[i].style, ...(zoom ? { backgroundSize: '250%' } : {}) }} onClick={() => setZoom(!zoom)} role="img" aria-label={p.name}>
        <div className="p-card__badges">{p.badges.map((b) => <span key={b} className="badge">{b}</span>)}</div>
        <div className="tools"><span><Icon name="search" /> {zoom ? 'Thu nhỏ' : 'Phóng to'}</span>{!p.images.length && <span><Icon name="swatch" /> Ảnh minh họa</span>}</div>
      </div>
    </div>
  )
}

export function BuyBox({ p, warranty }: { p: ProductView; warranty?: string }) {
  const { add, openQuote, settings } = useShop()
  const step = p.boxM2 || 1
  const [size, setSize] = useState(p.sizes[0] || '')
  const [finish, setFinish] = useState(p.finishes[0] || '')
  const [qty, setQty] = useState(step)
  const [area, setArea] = useState('')
  const [waste, setWaste] = useState(5)
  const isArea = p.unit === 'm²' && p.boxM2
  const a = Number(area)
  const boxes = isArea && a > 0 ? Math.ceil((a * (1 + waste / 100)) / p.boxM2!) : 0
  const m2 = Math.round(boxes * (p.boxM2 || 0) * 100) / 100
  const calc = (v: string, w = waste) => {
    setArea(v); const n = Number(v)
    if (isArea && n > 0) setQty(Math.round(Math.ceil((n * (1 + w / 100)) / p.boxM2!) * p.boxM2! * 100) / 100)
  }
  const Opt = ({ label, list, val, set }: { label: string; list: string[]; val: string; set: (v: string) => void }) => list.length ? (
    <div className="opt"><div className="opt__label">{label} <span>{val}</span></div>
      <div className="opt__list">{list.map((s) => <button key={s} className={`opt__btn ${s === val ? 'is-active' : ''}`} onClick={() => set(s)} aria-pressed={s === val}>{s}</button>)}</div></div>
  ) : null

  return (
    <>
      <Opt label="Kích thước" list={p.sizes} val={size} set={setSize} />
      <Opt label="Bề mặt / Màu hoàn thiện" list={p.finishes} val={finish} set={setFinish} />
      {isArea && (
        <div className="calc">
          <div className="calc__head"><Icon name="ruler" /> Tính số lượng cần mua</div>
          <div className="calc__row">
            <label className="field">Diện tích cần ốp/lát<div className="suffix"><input type="number" min="0" step="0.5" placeholder="VD: 25" value={area} onChange={(e) => calc(e.target.value)} /><span>m²</span></div></label>
            <label className="field">Hao hụt dự phòng<select value={waste} onChange={(e) => { setWaste(+e.target.value); calc(area, +e.target.value) }}>
              <option value={5}>5% – lát thẳng</option><option value={10}>10% – lát chéo / xương cá</option><option value={15}>15% – nhiều góc cắt</option></select></label>
          </div>
          <div className="calc__out">
            <div>Số hộp<b>{boxes ? `${boxes} hộp` : '–'}</b></div><div>Tổng diện tích<b>{boxes ? `${num(m2)} m²` : '–'}</b></div><div>Tạm tính<b>{boxes ? fmt(m2 * p.price) : '–'}</b></div>
          </div>
        </div>
      )}
      <div className="buy">
        <div className="qty">
          <button onClick={() => setQty(Math.max(step, Math.round((qty - step) * 100) / 100))} aria-label="Giảm"><Icon name="minus" className="" /></button>
          <input type="number" value={qty} min={step} step={step} onChange={(e) => setQty(Math.max(0, +e.target.value))} aria-label="Số lượng" />
          <button onClick={() => setQty(Math.round((qty + step) * 100) / 100)} aria-label="Tăng"><Icon name="plus" className="" /></button>
        </div>
        <button className="btn btn--primary" onClick={() => add({ ...toAdd(p), size, finish, qty: qty > 0 ? qty : step })}><Icon name="bag" /> Thêm vào giỏ hàng</button>
      </div>
      <div className="pdp__secondary">
        <button className="btn btn--outline" onClick={() => openQuote({ mode: 'sample', product: p.name, tex: p.tex, img: p.img })}><Icon name="swatch" /> Đặt mẫu miễn phí</button>
        <button className="btn btn--outline" onClick={() => openQuote({ mode: 'quote', product: `${p.name} – ${size} ${finish}`, tex: p.tex, img: p.img })}><Icon name="chat" /> Báo giá số lượng lớn</button>
      </div>
      <ul className="perks">
        <li><Icon name="truck" /> Giao trong 24h nội thành Đà Nẵng · Miễn phí cho đơn từ {fmt(settings.freeShipThreshold ?? 5000000)}</li>
        <li><Icon name="shield" /> Hàng chính hãng, đầy đủ CO/CQ{warranty ? ` · Bảo hành ${warranty}` : ''}</li>
        <li><Icon name="check" /> Đổi trả trong 7 ngày với sản phẩm còn nguyên đai kiện</li>
      </ul>
    </>
  )
}

export function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(open)
  return <div className={`acc ${o ? 'is-open' : ''}`}><button onClick={() => setO(!o)} aria-expanded={o}>{title} <Icon name="chev" /></button><div className="acc__body">{children}</div></div>
}
