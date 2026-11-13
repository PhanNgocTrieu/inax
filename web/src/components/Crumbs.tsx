import Link from 'next/link'

export function Crumbs({ items }: { items: [string, string?][] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/">Trang chủ</Link>
      {items.map(([t, h]) => <span key={t}>{h ? <Link href={h}>{t}</Link> : t}</span>)}
    </nav>
  )
}
