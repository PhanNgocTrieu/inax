import type { CollectionConfig } from 'payload'
import { staff } from './access'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: { singular: 'Mã giảm giá', plural: 'Mã giảm giá' },
  admin: { useAsTitle: 'code', group: 'Bán hàng', defaultColumns: ['code', 'type', 'value', 'active', 'usedCount'] },
  access: { read: staff, create: staff, update: staff, delete: staff },
  fields: [
    { name: 'code', label: 'Mã', type: 'text', required: true, unique: true, hooks: { beforeValidate: [({ value }) => (value ? String(value).trim().toUpperCase() : value)] } },
    {
      type: 'row', fields: [
        { name: 'type', label: 'Loại', type: 'select', required: true, defaultValue: 'percent', options: [{ label: 'Phần trăm (%)', value: 'percent' }, { label: 'Số tiền (₫)', value: 'fixed' }] },
        { name: 'value', label: 'Giá trị', type: 'number', required: true, min: 0 },
        { name: 'maxDiscount', label: 'Giảm tối đa (₫)', type: 'number' },
      ],
    },
    {
      type: 'row', fields: [
        { name: 'minSubtotal', label: 'Đơn tối thiểu (₫)', type: 'number', defaultValue: 0 },
        { name: 'usageLimit', label: 'Số lượt tối đa', type: 'number' },
        { name: 'usedCount', label: 'Đã dùng', type: 'number', defaultValue: 0, admin: { readOnly: true } },
      ],
    },
    { name: 'expiresAt', label: 'Hết hạn', type: 'date' },
    { name: 'active', label: 'Đang kích hoạt', type: 'checkbox', defaultValue: true },
  ],
}
