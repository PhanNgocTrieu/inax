'use client'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { CatView } from '@/lib/data'
import { bgImage, texture, type TexSpec } from '@/lib/texture'
import { fmt } from './format'
import { useShop } from './Providers'
import { Icon } from './Sprite'

const PROMO_TEX: TexSpec = { t: 'travertine', base: '#e4d4bb', dark: '#b89d79', seed: 13 }
type Hit = { slug: string; name: string; price: number; unit: string; img: string | null; tex: TexSpec | null }

export function Header({ cats }: { cats: CatView[] }) {
  const { settings: s, count, setCartOpen, openQuote } = useShop()
  const pathname = usePathname()
  const params = useSearchParams()
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [nav, setNav] = useState(false)
  const [search, setSearch] = useState(false)
  const [bump, setBump] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    const f = () => setScrolled(scrollY > 10)
    addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [])
  useEffect(() => { setMega(false); setNav(false); setSearch(false) }, [pathname, params])
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setBump(true); const t = setTimeout(() => setBump(false), 300); return () => clearTimeout(t)
  }, [count])
  useEffect(() => { document.body.style.overflow = nav || search ? 'hidden' : '' }, [nav, search])

  const active = (p: string) => (pathname === p || pathname.startsWith(p + '/') ? 'is-active' : '')
  const tel = (s.hotline || '').replace(/\s/g, '')

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__left">
            <span><Icon name="pin" />{s.address}</span>
            <span className="hide-sm"><Icon name="clock" />T2–T7 · 7:30–17:30</span>
          </div>
          <div className="topbar__right">
            <Link href="/lien-he" className="hide-sm">Showroom</Link>
            <Link href="/du-an" className="hide-md hide-sm">Dành cho nhà thầu & kiến trúc sư</Link>
            {s.hotline && <a className="topbar__hot" href={`tel:${tel}`}><Icon name="phone" />Hotline <b>{s.hotline}</b></a>}
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header__inner">
          <button className="icon-btn only-mobile" onClick={() => setNav(true)} aria-label="Mở menu"><Icon name="menu" className="" /></button>
          <Link href="/" className="logo" aria-label="GreenHabitat – Trang chủ">
            <Icon name="leaf" className="logo__mark" />
            <span className="logo__text"><b>GreenHabitat</b><small>TNT Thịnh Phát</small></span>
          </Link>
          <nav className="nav" aria-label="Chính">
            <div className={`nav__item has-mega ${mega ? 'is-open' : 'is-hidden'}`} onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
              <Link href="/san-pham" className={!params.get('room') ? active('/san-pham') : ''}>Sản phẩm <Icon name="chev" /></Link>
              <div className="mega">
                <div className="mega__inner">
                  {cats.map((c) => (
                    <Link key={c.id} className="mega__cat" href={`/san-pham?cat=${c.slug}`}>
                      <span className="thumb" style={{ backgroundImage: bgImage(c.img, c.tex) }} />
                      <div><b>{c.name}</b><span>{c.short}</span></div>
                    </Link>
                  ))}
                  <Link className="mega__promo" href="/san-pham" style={{ backgroundImage: texture(PROMO_TEX) }}>
                    <p className="eyebrow eyebrow--light">Mới · 2026</p><h4>Bộ sưu tập Terra</h4><span className="link">Khám phá <Icon name="arrow" /></span>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/san-pham?room=phong-tam" className={params.get('room') ? 'is-active' : ''}>Không gian</Link>
            <Link href="/du-an" className={active('/du-an')}>Dự án</Link>
            <Link href="/gioi-thieu" className={active('/gioi-thieu')}>Về chúng tôi</Link>
            <Link href="/lien-he" className={active('/lien-he')}>Liên hệ</Link>
          </nav>
          <div className="header__actions">
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="Tìm kiếm"><Icon name="search" className="" /></button>
            <Link className="icon-btn hide-sm" href="/tai-khoan" aria-label="Tài khoản"><Icon name="user" className="" /></Link>
            <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)} aria-label={`Giỏ hàng (${count})`}>
              <Icon name="bag" className="" /><span className={`cart-count ${bump ? 'bump' : ''}`} data-n={count}>{count}</span>
            </button>
            <button className="btn btn--primary btn--sm hide-md" onClick={() => openQuote({ mode: 'quote' })}>Nhận báo giá</button>
          </div>
        </div>
      </header>

      <div className={`scrim ${nav || search ? 'is-on' : ''}`} onClick={() => { setNav(false); setSearch(false) }} />
      <aside className={`drawer drawer--left ${nav ? 'is-open' : ''}`} aria-label="Menu" aria-hidden={!nav}>
        <div className="drawer__head">
          <Link href="/" className="logo"><Icon name="leaf" className="logo__mark" /><span className="logo__text"><b>GreenHabitat</b></span></Link>
          <button className="icon-btn" onClick={() => setNav(false)} aria-label="Đóng"><Icon name="close" className="" /></button>
        </div>
        <nav className="mnav">
          <Link href="/san-pham">Tất cả sản phẩm <Icon name="arrow" /></Link>
          <div className="sub">{cats.map((c) => <Link key={c.id} href={`/san-pham?cat=${c.slug}`}>{c.name}</Link>)}</div>
          <Link href="/san-pham?room=phong-tam">Không gian</Link><Link href="/du-an">Dự án</Link>
          <Link href="/gioi-thieu">Về chúng tôi</Link><Link href="/lien-he">Liên hệ</Link><Link href="/tai-khoan">Tài khoản</Link>
        </nav>
        <div style={{ padding: 24 }}>
          <button className="btn btn--primary btn--block" onClick={() => { setNav(false); openQuote({ mode: 'quote' }) }}>Nhận báo giá</button>
          {s.hotline && <p className="muted" style={{ marginTop: 16, fontSize: 13 }}><Icon name="phone" /> {s.hotline}</p>}
        </div>
      </aside>
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  )
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setOpen(true)) }, [])
  useEffect(() => {
    const term = q.trim()
    if (!term) { setHits(null); return }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      const sp = new URLSearchParams({ 'where[name][like]': term, limit: '12', depth: '1' })
      try {
        const r = await fetch(`/api/products?${sp}`, { signal: ctrl.signal }).then((x) => x.json())
        setHits((r.docs || []).map((p: { slug: string; name: string; price: number; unit: string; texture: TexSpec; images?: { sizes?: { thumb?: { url?: string } }; url?: string }[] }) => ({
          slug: p.slug, name: p.name, price: p.price, unit: p.unit, tex: p.texture, img: p.images?.[0]?.sizes?.thumb?.url || p.images?.[0]?.url || null,
        })))
      } catch { /* aborted */ }
    }, 200)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [q])
  return (
    <div className={`search-overlay ${open ? 'is-open' : ''}`} role="dialog" aria-label="Tìm kiếm">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng"><Icon name="close" className="" /></button>
        </div>
        <form className="search-box" onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/san-pham?q=${encodeURIComponent(q.trim())}`) }}>
          <Icon name="search" className="" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm gạch, đá, sàn gỗ, lavabo…" autoComplete="off" aria-label="Từ khóa" />
        </form>
        {hits === null ? (
          <div className="search-hints"><span className="muted">Tìm nhiều:</span>
            {['Terrazzo', 'Marble', 'Sàn gỗ', 'Lavabo', 'Zellige', 'Microcement'].map((t) => <button key={t} className="chip-btn chip-btn--plain" onClick={() => setQ(t)}>{t}</button>)}
          </div>
        ) : hits.length ? (
          <div className="search-results">{hits.map((h) => (
            <Link key={h.slug} className="sr-item" href={`/san-pham/${h.slug}`}>
              <span className="t" style={{ backgroundImage: bgImage(h.img, h.tex) }} />
              <div><b style={{ fontWeight: 500 }}>{h.name}</b><div className="muted" style={{ fontSize: 13 }}>{fmt(h.price)}/{h.unit}</div></div>
            </Link>))}
          </div>
        ) : <p className="muted" style={{ padding: '24px 0 40px' }}>Không tìm thấy kết quả cho “{q}”.</p>}
      </div>
    </div>
  )
}
