'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { PublicSettings } from '@/lib/data'
import type { TexSpec } from '@/lib/texture'
import { CartDrawer } from './CartDrawer'
import { QuoteModal, type QuoteCtx } from './QuoteModal'
import { Icon } from './Sprite'

export type CartLine = {
  key: string; id: number; slug: string; name: string; catName: string; price: number; unit: string
  boxM2: number | null; size: string; finish: string; qty: number; img: string | null; tex: TexSpec | null
}
export type AddInput = Omit<CartLine, 'key' | 'qty' | 'size' | 'finish'> & { size?: string; finish?: string; qty?: number; sizes?: string[]; finishes?: string[] }

type Ctx = {
  settings: PublicSettings
  lines: CartLine[]; count: number; subtotal: number; ready: boolean
  add: (p: AddInput) => void; step: (key: string, dir: 1 | -1) => void; remove: (key: string) => void; clear: () => void
  cartOpen: boolean; setCartOpen: (v: boolean) => void
  toast: (msg: string) => void
  openQuote: (ctx: QuoteCtx) => void
  favs: number[]; toggleFav: (id: number) => void
}
const C = createContext<Ctx | null>(null)
export const useShop = () => {
  const c = useContext(C)
  if (!c) throw new Error('useShop outside provider')
  return c
}
const read = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* private mode */ } }

export function Providers({ settings, children }: { settings: PublicSettings; children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [favs, setFavs] = useState<number[]>([])
  const [ready, setReady] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [quote, setQuote] = useState<QuoteCtx | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const pathname = usePathname()

  useEffect(() => { setLines(read('gh_cart_v2', [])); setFavs(read('gh_favs', [])); setReady(true) }, [])
  useEffect(() => { if (ready) write('gh_cart_v2', lines) }, [lines, ready])
  useEffect(() => { setCartOpen(false); setQuote(null) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = cartOpen || quote ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setCartOpen(false); setQuote(null) } }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [cartOpen, quote])

  const toast = useCallback((m: string) => {
    setToastMsg(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToastMsg(null), 2600)
  }, [])
  const add = useCallback((p: AddInput) => {
    const size = p.size || p.sizes?.[0] || '', finish = p.finish || p.finishes?.[0] || ''
    const qty = Math.round((p.qty || p.boxM2 || 1) * 100) / 100
    const key = `${p.id}|${size}|${finish}`
    setLines((ls) => {
      const ex = ls.find((l) => l.key === key)
      if (ex) return ls.map((l) => (l === ex ? { ...l, qty: Math.round((l.qty + qty) * 100) / 100 } : l))
      const { sizes: _s, finishes: _f, ...rest } = p
      return [...ls, { ...rest, key, size, finish, qty }]
    })
    setCartOpen(true)
  }, [])
  const step = useCallback((key: string, dir: 1 | -1) => setLines((ls) => ls.flatMap((l) => {
    if (l.key !== key) return [l]
    const q = Math.round((l.qty + dir * (l.boxM2 || 1)) * 100) / 100
    return q > 0 ? [{ ...l, qty: q }] : []
  })), [])
  const remove = useCallback((key: string) => setLines((ls) => ls.filter((l) => l.key !== key)), [])
  const clear = useCallback(() => setLines([]), [])
  const toggleFav = useCallback((id: number) => setFavs((f) => {
    const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
    write('gh_favs', n); toast(n.includes(id) ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích'); return n
  }), [toast])

  const value = useMemo<Ctx>(() => ({
    settings, lines, ready, count: lines.length, subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
    add, step, remove, clear, cartOpen, setCartOpen, toast, openQuote: setQuote, favs, toggleFav,
  }), [settings, lines, ready, add, step, remove, clear, cartOpen, toast, favs, toggleFav])

  return (
    <C.Provider value={value}>
      {children}
      <div className={`scrim ${cartOpen ? 'is-on' : ''}`} onClick={() => setCartOpen(false)} />
      <CartDrawer />
      {quote && <QuoteModal ctx={quote} onClose={() => setQuote(null)} />}
      <div className={`toast ${toastMsg ? 'is-on' : ''}`} role="status"><Icon name="check" />{toastMsg}</div>
    </C.Provider>
  )
}
