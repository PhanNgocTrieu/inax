import type { CollectionConfig } from 'payload'
import { adminOnly, staff } from './access'

export const ORDER_STATUS = [
  { label: 'Chờ thanh toán', value: 'pending_payment' },
  { label: 'Đã đặt cọc', value: 'deposit_paid' },
  { label: 'Đã thanh toán', value: 'paid' },
  { label: 'Chờ xác nhận (COD)', value: 'pending_confirm' },
  { label: 'Đang chuẩn bị hàng', value: 'processing' },
  { label: 'Đang giao', value: 'shipping' },
  { label: 'Hoàn tất', value: 'completed' },
  { label: 'Thanh toán thất bại', value: 'failed' },
  { label: 'Đã hủy', value: 'cancelled' },
]
export const PAY_METHODS = [
  { label: 'VNPAY', value: 'vnpay' },
  { label: 'Ví MoMo', value: 'momo' },
  { label: 'ZaloPay', value: 'zalopay' },
  { label: 'Thẻ quốc tế', value: 'card' },
  { label: 'Chuyển khoản VietQR', value: 'bank' },
  { label: 'Đặt cọc', value: 'deposit' },
  { label: 'COD', value: 'cod' },
]
export const SHIP_METHODS = [
  { label: 'Giao nội thành Đà Nẵng', value: 'dn' },
  { label: 'Giao tỉnh / thành khác', value: 'tinh' },
  { label: 'Nhận tại showroom', value: 'pickup' },
]

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Đơn hàng', plural: 'Đơn hàng' },
  admin: {
    useAsTitle: 'code', group: 'Bán hàng',
    defaultColumns: ['code', 'customerName', 'total', 'paymentMethod', 'status', 'createdAt'],
    listSearchableFields: ['code', 'customerName', 'customerPhone'],
  },
  // Đơn chỉ được tạo qua API thanh toán của website (overrideAccess) hoặc bởi nhân viên
  access: { read: staff, create: staff, update: staff, delete: adminOnly },
  defaultSort: '-createdAt',
  fields: [
    { name: 'code', label: 'Mã đơn', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: 'status', label: 'Trạng thái', type: 'select', required: true, defaultValue: 'pending_payment', options: ORDER_STATUS, admin: { position: 'sidebar' } },
    { name: 'paymentMethod', label: 'Thanh toán', type: 'select', options: PAY_METHODS, admin: { position: 'sidebar' } },
    { name: 'shippingMethod', label: 'Giao hàng', type: 'select', options: SHIP_METHODS, admin: { position: 'sidebar' } },
    {
      type: 'collapsible', label: 'Khách hàng', fields: [
        { type: 'row', fields: [
          { name: 'customerName', label: 'Họ tên', type: 'text', required: true },
          { name: 'customerPhone', label: 'Điện thoại', type: 'text', required: true },
          { name: 'customerEmail', label: 'Email', type: 'email' },
        ] },
        { type: 'row', fields: [
          { name: 'province', label: 'Tỉnh / thành', type: 'text' },
          { name: 'ward', label: 'Phường / xã', type: 'text' },
        ] },
        { name: 'address', label: 'Địa chỉ', type: 'text' },
        { name: 'note', label: 'Ghi chú của khách', type: 'textarea' },
        { name: 'vat', label: 'Xuất hóa đơn VAT', type: 'group', fields: [
          { name: 'enabled', label: 'Có xuất hóa đơn', type: 'checkbox' },
          { type: 'row', fields: [
            { name: 'company', label: 'Tên công ty', type: 'text' },
            { name: 'taxCode', label: 'Mã số thuế', type: 'text' },
          ] },
          { name: 'address', label: 'Địa chỉ xuất hóa đơn', type: 'text' },
        ] },
      ],
    },
    {
      name: 'items', label: 'Sản phẩm', type: 'array', required: true, minRows: 1,
      admin: { initCollapsed: false },
      fields: [
        { type: 'row', fields: [
          { name: 'product', label: 'Sản phẩm', type: 'relationship', relationTo: 'products' },
          { name: 'name', label: 'Tên', type: 'text', required: true },
        ] },
        { type: 'row', fields: [
          { name: 'size', label: 'Kích thước', type: 'text' },
          { name: 'finish', label: 'Bề mặt', type: 'text' },
          { name: 'unit', label: 'ĐVT', type: 'text' },
        ] },
        { type: 'row', fields: [
          { name: 'unitPrice', label: 'Đơn giá', type: 'number', required: true },
          { name: 'qty', label: 'Số lượng', type: 'number', required: true },
          { name: 'lineTotal', label: 'Thành tiền', type: 'number', required: true },
        ] },
      ],
    },
    { type: 'row', fields: [
      { name: 'subtotal', label: 'Tạm tính', type: 'number', required: true },
      { name: 'discount', label: 'Giảm giá', type: 'number', defaultValue: 0 },
      { name: 'couponCode', label: 'Mã giảm giá', type: 'text' },
    ] },
    { type: 'row', fields: [
      { name: 'shippingFee', label: 'Phí vận chuyển', type: 'number', defaultValue: 0 },
      { name: 'total', label: 'Tổng cộng', type: 'number', required: true },
      { name: 'amountDue', label: 'Số tiền cần thanh toán online', type: 'number', admin: { description: 'Bằng tổng tiền, hoặc tiền cọc nếu chọn đặt cọc' } },
    ] },
    {
      name: 'payments', label: 'Lịch sử giao dịch', type: 'array', admin: { readOnly: true },
      fields: [
        { type: 'row', fields: [
          { name: 'provider', label: 'Cổng', type: 'text' },
          { name: 'amount', label: 'Số tiền', type: 'number' },
          { name: 'status', label: 'Kết quả', type: 'text' },
          { name: 'transactionId', label: 'Mã giao dịch', type: 'text' },
        ] },
        { name: 'at', label: 'Thời gian', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'raw', label: 'Dữ liệu gốc', type: 'json' },
      ],
    },
    { name: 'paidAmount', label: 'Đã thanh toán', type: 'number', defaultValue: 0, admin: { position: 'sidebar', readOnly: true } },
    { name: 'accessToken', type: 'text', admin: { hidden: true } },
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
