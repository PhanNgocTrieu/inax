'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useShop } from './Providers'
import { Icon } from './Sprite'

/** Hiệu ứng hiện dần khi cuộn – chạy lại mỗi lần đổi trang */
export function Reveal() {
  const pathname = usePathname(), params = useSearchParams()
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)')
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return }
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target) } }), { rootMargin: '0px 0px -8% 0px' })
    const scan = () => document.querySelectorAll('.reveal:not(.is-in)').forEach((e) => io.observe(e))
    scan()
    const mo = new MutationObserver(scan); mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [pathname, params])
  return null
}

export function Fab() {
  const { settings: s, toast } = useShop()
  const zalo = (s.zalo || '').replace(/\D/g, '')
  return (
    <div className="fab">
      <a className="fab__btn fab__btn--zalo" href={zalo ? `https://zalo.me/${zalo}` : '#'} target="_blank" rel="noopener"
        onClick={(e) => { if (!zalo) { e.preventDefault(); toast('Chưa cấu hình số Zalo') } }} aria-label="Chat Zalo">Zalo</a>
      <a className="fab__btn" href={`tel:${(s.hotline || '').replace(/\s/g, '')}`} aria-label="Gọi hotline"><Icon name="phone" className="" /></a>
    </div>
  )
}
