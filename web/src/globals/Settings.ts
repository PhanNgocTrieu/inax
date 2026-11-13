import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Cài đặt website',
  admin: { group: 'Hệ thống' },
  access: { read: () => true, update: ({ req }) => req.user?.role === 'admin' },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'Công ty', fields: [
        { name: 'legalName', label: 'Tên pháp lý', type: 'text', defaultValue: 'CÔNG TY TNHH THƯƠNG MẠI TNT THỊNH PHÁT' },
        { name: 'taxCode', label: 'Mã số thuế', type: 'text' },
        { name: 'address', label: 'Địa chỉ showroom', type: 'text', defaultValue: '267 Thái Văn Lung, Hòa Xuân, Đà Nẵng' },
        { type: 'row', fields: [
          { name: 'hotline', label: 'Hotline', type: 'text' },
          { name: 'zalo', label: 'Zalo', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
        ] },
        { name: 'hours', label: 'Giờ mở cửa', type: 'text', defaultValue: 'Thứ 2 – Thứ 7: 7:30 – 17:30 · CN: 8:00 – 12:00' },
        { name: 'mapEmbed', label: 'Link nhúng Google Maps', type: 'text', defaultValue: 'https://www.google.com/maps?q=16.0164123,108.2304191&z=17&output=embed' },
        { name: 'mapLink', label: 'Link chỉ đường', type: 'text', defaultValue: 'https://www.google.com/maps/dir/?api=1&destination=16.0164123,108.2304191' },
        { name: 'brands', label: 'Thương hiệu phân phối', type: 'text', hasMany: true },
      ] },
      { label: 'Bán hàng', fields: [
        { type: 'row', fields: [
          { name: 'freeShipThreshold', label: 'Miễn phí giao từ (₫)', type: 'number', defaultValue: 5000000 },
          { name: 'innerCityFee', label: 'Phí nội thành (₫)', type: 'number', defaultValue: 150000 },
          { name: 'provinceFee', label: 'Phí tỉnh khác (₫)', type: 'number', defaultValue: 450000 },
        ] },
        { type: 'row', fields: [
          { name: 'codLimit', label: 'COD tối đa (₫)', type: 'number', defaultValue: 20000000 },
          { name: 'depositPercent', label: 'Tỷ lệ đặt cọc (%)', type: 'number', defaultValue: 30 },
        ] },
        { name: 'enabledPayments', label: 'Phương thức thanh toán đang bật', type: 'select', hasMany: true,
          defaultValue: ['vnpay', 'momo', 'zalopay', 'card', 'bank', 'deposit', 'cod'],
          options: [
            { label: 'VNPAY', value: 'vnpay' }, { label: 'MoMo', value: 'momo' }, { label: 'ZaloPay', value: 'zalopay' },
            { label: 'Thẻ quốc tế', value: 'card' }, { label: 'Chuyển khoản VietQR', value: 'bank' },
            { label: 'Đặt cọc', value: 'deposit' }, { label: 'COD', value: 'cod' },
          ] },
      ] },
      { label: 'Tài khoản nhận tiền', fields: [
        { type: 'row', fields: [
          { name: 'bankCode', label: 'Mã ngân hàng VietQR (VD: VCB, TCB, MB)', type: 'text' },
          { name: 'bankName', label: 'Tên ngân hàng', type: 'text' },
        ] },
        { type: 'row', fields: [
          { name: 'bankAccount', label: 'Số tài khoản', type: 'text' },
          { name: 'bankAccountName', label: 'Chủ tài khoản', type: 'text', defaultValue: 'CONG TY TNHH TM TNT THINH PHAT' },
        ] },
      ] },
    ] },
  ],
}
