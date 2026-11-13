import type { CollectionConfig } from 'payload'
import { staff } from './access'

export const Requests: CollectionConfig = {
  slug: 'requests',
  labels: { singular: 'Yêu cầu khách hàng', plural: 'Báo giá & Liên hệ' },
  admin: { useAsTitle: 'name', group: 'Bán hàng', defaultColumns: ['type', 'name', 'phone', 'products', 'status', 'createdAt'] },
  // Website tạo qua API /api/shop/request (overrideAccess); nhân viên xem & xử lý
  access: { read: staff, create: staff, update: staff, delete: staff },
  defaultSort: '-createdAt',
  fields: [
    { name: 'type', label: 'Loại', type: 'select', required: true, options: [
      { label: 'Báo giá', value: 'quote' }, { label: 'Đặt mẫu', value: 'sample' },
      { label: 'Đặt lịch tham quan', value: 'visit' }, { label: 'Liên hệ', value: 'contact' },
      { label: 'Đăng ký bản tin', value: 'newsletter' },
    ] },
    { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'new', admin: { position: 'sidebar' }, options: [
      { label: 'Mới', value: 'new' }, { label: 'Đã liên hệ', value: 'contacted' }, { label: 'Đã báo giá', value: 'quoted' },
      { label: 'Thành công', value: 'won' }, { label: 'Không thành', value: 'lost' },
    ] },
    { name: 'assignee', label: 'Phụ trách', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
    { type: 'row', fields: [
      { name: 'name', label: 'Họ tên', type: 'text' },
      { name: 'phone', label: 'Điện thoại', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
    ] },
    { type: 'row', fields: [
      { name: 'customerType', label: 'Khách là', type: 'text' },
      { name: 'projectType', label: 'Loại công trình', type: 'text' },
      { name: 'topic', label: 'Chủ đề', type: 'text' },
    ] },
    { name: 'products', label: 'Sản phẩm quan tâm', type: 'text' },
    { type: 'row', fields: [
      { name: 'area', label: 'Diện tích (m²)', type: 'number' },
      { name: 'timeline', label: 'Thời gian thi công', type: 'text' },
      { name: 'visitDate', label: 'Ngày hẹn', type: 'text' },
    ] },
    { name: 'address', label: 'Địa chỉ', type: 'text' },
    { name: 'note', label: 'Nội dung', type: 'textarea' },
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea' },
  ],
}
