import type { CollectionConfig } from 'payload'
import { adminOnly, staff } from './access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Nhân viên', plural: 'Nhân viên' },
  admin: { useAsTitle: 'email', group: 'Hệ thống' },
  auth: true,
  access: { read: staff, create: adminOnly, delete: adminOnly, update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id },
  fields: [
    { name: 'name', label: 'Họ tên', type: 'text' },
    {
      name: 'role', label: 'Vai trò', type: 'select', required: true, defaultValue: 'sales',
      options: [
        { label: 'Quản trị', value: 'admin' },
        { label: 'Bán hàng', value: 'sales' },
        { label: 'Biên tập nội dung', value: 'editor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
}
