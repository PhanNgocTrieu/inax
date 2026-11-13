import type { CollectionConfig } from 'payload'
import { anyone, staff } from './access'
import { slugField, textureField } from './fields'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Danh mục', plural: 'Danh mục' },
  admin: { useAsTitle: 'name', group: 'Sản phẩm', defaultColumns: ['name', 'slug', 'order'] },
  access: { read: anyone, create: staff, update: staff, delete: staff },
  defaultSort: 'order',
  fields: [
    { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
    slugField(),
    { name: 'short', label: 'Mô tả ngắn', type: 'text' },
    { name: 'image', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media' },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    textureField,
  ],
}
