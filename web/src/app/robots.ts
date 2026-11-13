import type { MetadataRoute } from 'next'

// Đọc env lúc chạy (không gắn cứng lúc build) để SITE_NOINDEX có hiệu lực ngay
export const dynamic = 'force-dynamic'
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  // SITE_NOINDEX=1 (bản demo) => chặn công cụ tìm kiếm
  if (process.env.SITE_NOINDEX === '1') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/gio-hang', '/thanh-toan', '/dat-hang'] }], sitemap: `${base}/sitemap.xml` }
}
