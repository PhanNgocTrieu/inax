import type { CollectionConfig } from 'payload'
import { anyone, staff } from './access'
import { slugField, textureField } from './fields'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án' },
  admin: { useAsTitle: 'name', group: 'Nội dung', defaultColumns: ['name', 'type', 'year'] },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  defaultSort: '-year',
  fields: [
    { name: 'name', label: 'Tên dự án', type: 'text', required: true },
    slugField(),
    {
      type: 'row', fields: [
        { name: 'type', label: 'Loại công trình', type: 'text' },
        { name: 'year', label: 'Năm', type: 'number' },
        { name: 'area', label: 'Diện tích', type: 'text' },
      ],
    },
    { name: 'location', label: 'Địa điểm', type: 'text' },
    { name: 'materials', label: 'Vật liệu sử dụng (mô tả)', type: 'text' },
    { name: 'products', label: 'Sản phẩm đã dùng', type: 'relationship', relationTo: 'products', hasMany: true },
    { name: 'cover', label: 'Ảnh bìa', type: 'upload', relationTo: 'media' },
    { name: 'gallery', label: 'Thư viện ảnh', type: 'upload', relationTo: 'media', hasMany: true },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    textureField,
  ],
}
