import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Fraunces } from 'next/font/google'
import { Suspense } from 'react'
import { Fab, Reveal } from '@/components/Chrome'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Providers } from '@/components/Providers'
import { Sprite } from '@/components/Sprite'
import { getCategories, getSettings, publicSettings } from '@/lib/data'
import './globals.css'

const display = Fraunces({ subsets: ['latin', 'vietnamese'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-display', display: 'swap' })
const ui = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['300', '400', '500', '600', '700'], variable: '--font-ui', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'GreenHabitat — Vật liệu xây dựng & Trang trí nội thất Đà Nẵng', template: '%s | GreenHabitat' },
  description: 'GreenHabitat (Công ty TNHH Thương mại TNT Thịnh Phát) – gạch ốp lát, đá tự nhiên, sàn gỗ, thiết bị vệ sinh và vật liệu hoàn thiện nội thất chính hãng tại Đà Nẵng.',
  openGraph: { siteName: 'GreenHabitat', locale: 'vi_VN', type: 'website' },
  robots: process.env.SITE_NOINDEX === '1' ? { index: false, follow: false } : undefined,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, cats] = await Promise.all([getSettings(), getCategories()])
  const s = publicSettings(settings)
  const ld = {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: 'GreenHabitat – ' + (s.legalName || ''),
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: 'Đà Nẵng', addressCountry: 'VN' },
    geo: { '@type': 'GeoCoordinates', latitude: 16.0164123, longitude: 108.2304191 }, telephone: s.hotline || undefined,
  }
  return (
    <html lang="vi" className={`${display.variable} ${ui.variable}`}>
      <body>
        <Sprite />
        <Providers settings={s}>
          <Suspense><Header cats={cats} /></Suspense>
          <main id="main">{children}</main>
          <Footer s={s} cats={cats} />
          <Fab />
          <Suspense><Reveal /></Suspense>
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  )
}
