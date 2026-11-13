import type { CollectionConfig } from 'payload'
import { anyone, staff } from './access'
import { COLOR_OPTIONS, ROOM_OPTIONS, slugField, textureField } from './fields'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Sản phẩm', plural: 'Sản phẩm' },
  admin: {
    useAsTitle: 'name', group: 'Sản phẩm',
    defaultColumns: ['name', 'category', 'price', 'stock', 'published'],
    listSearchableFields: ['name', 'sku'],
  },
  access: {
    read: ({ req }) => (req.user ? true : { published: { equals: true } }),
    create: staff, update: staff, delete: staff,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin chung',
          fields: [
            { name: 'name', label: 'Tên sản phẩm', type: 'text', required: true },
            {
              type: 'row', fields: [
                { name: 'category', label: 'Danh mục', type: 'relationship', relationTo: 'categories', required: true },
                { name: 'sku', label: 'Mã sản phẩm (SKU)', type: 'text' },
              ],
            },
            {
              type: 'row', fields: [
                { name: 'brand', label: 'Thương hiệu', type: 'text' },
                { name: 'origin', label: 'Xuất xứ', type: 'text' },
              ],
            },
            { name: 'description', label: 'Mô tả', type: 'textarea' },
            { name: 'images', label: 'Ảnh sản phẩm', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        {
          label: 'Giá & kho',
          fields: [
            {
              type: 'row', fields: [
                { name: 'price', label: 'Giá bán (đã gồm VAT)', type: 'number', required: true, min: 0 },
                { name: 'oldPrice', label: 'Giá gốc (nếu đang giảm)', type: 'number', min: 0 },
              ],
            },
            {
              type: 'row', fields: [
                {
                  name: 'unit', label: 'Đơn vị tính', type: 'select', required: true, defaultValue: 'm²',
                  options: ['m²', 'cái', 'bộ', 'm', 'thùng', 'hộp'].map((v) => ({ label: v, value: v })),
                },
                { name: 'boxM2', label: 'Quy cách (m²/hộp)', type: 'number', admin: { description: 'Dùng cho máy tính diện tích – để trống nếu không bán theo hộp' } },
                { name: 'stock', label: 'Tồn kho', type: 'number', defaultValue: 0 },
              ],
            },
            { name: 'sizes', label: 'Kích thước', type: 'text', hasMany: true },
            { name: 'finishes', label: 'Bề mặt / Màu hoàn thiện', type: 'text', hasMany: true },
          ],
        },
        {
          label: 'Phân loại & lọc',
          fields: [
            { name: 'rooms', label: 'Không gian', type: 'select', hasMany: true, options: ROOM_OPTIONS },
            { name: 'color', label: 'Tông màu', type: 'select', options: COLOR_OPTIONS },
            {
              name: 'badges', label: 'Nhãn', type: 'select', hasMany: true,
              options: ['Mới', 'Bán chạy', 'Ưu đãi', 'Cao cấp', 'Thủ công'].map((v) => ({ label: v, value: v })),
            },
          ],
        },
        {
          label: 'Thông số & tài liệu',
          fields: [
            { name: 'specs', label: 'Thông số kỹ thuật', type: 'array', fields: [
              { type: 'row', fields: [{ name: 'label', label: 'Thông số', type: 'text', required: true }, { name: 'value', label: 'Giá trị', type: 'text', required: true }] },
            ] },
            { name: 'documents', label: 'Tài liệu tải về', type: 'array', fields: [
              { type: 'row', fields: [{ name: 'title', label: 'Tên tài liệu', type: 'text', required: true }, { name: 'file', label: 'File', type: 'upload', relationTo: 'media' }] },
            ] },
          ],
        },
      ],
    },
    slugField(),
    { name: 'published', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Sản phẩm nổi bật', type: 'checkbox', admin: { position: 'sidebar' } },
    textureField,
  ],
}
