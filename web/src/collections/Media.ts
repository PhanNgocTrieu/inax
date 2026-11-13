import type { CollectionConfig } from 'payload'
import { anyone, staff } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh / Tài liệu', plural: 'Thư viện' },
  admin: { group: 'Nội dung' },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  fields: [{ name: 'alt', label: 'Mô tả ảnh (SEO)', type: 'text' }],
  upload: {
    // Production: trỏ MEDIA_DIR vào ổ lưu trữ bền (volume), vd /data/media
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*', 'application/pdf', 'application/zip'],
    imageSizes: [
      { name: 'thumb', width: 400 },
      { name: 'card', width: 900 },
      { name: 'large', width: 1800 },
    ],
  },
}
