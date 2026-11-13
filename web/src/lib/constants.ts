import type { TexSpec } from './texture'

export const ROOMS: { id: string; name: string; desc: string; tex: TexSpec }[] = [
  { id: 'phong-tam', name: 'Phòng tắm', desc: 'Gạch chống trơn, thiết bị vệ sinh, đá ốp', tex: { t: 'tile', colors: ['#5d7f72', '#4f7266', '#6b8c7f', '#557868'], w: 50, h: 100, grout: '#e8e2d8', seed: 11 } },
  { id: 'nha-bep', name: 'Nhà bếp', desc: 'Đá mặt bếp, gạch backsplash', tex: { t: 'marble', base: '#2a2a2a', vein: '#d8d4cc', seed: 21 } },
  { id: 'phong-khach', name: 'Phòng khách', desc: 'Sàn gỗ, đá khổ lớn, tấm ốp', tex: { t: 'wood', base: '#d6b48c', dark: '#a27a52', seed: 9 } },
  { id: 'ngoai-troi', name: 'Ngoài trời', desc: 'Đá sân vườn, gạch terrazzo, WPC', tex: { t: 'travertine', base: '#e2d3bb', dark: '#bda585', seed: 13 } },
]
export const COLORS = [
  { id: 'trang', name: 'Trắng', hex: '#f4f2ee' }, { id: 'be', name: 'Be / Kem', hex: '#dccbb0' },
  { id: 'xam', name: 'Xám', hex: '#9c9a95' }, { id: 'den', name: 'Đen', hex: '#222' },
  { id: 'nau', name: 'Nâu gỗ', hex: '#7a5236' }, { id: 'xanh', name: 'Xanh', hex: '#2f5d50' },
  { id: 'vang', name: 'Vàng đồng', hex: '#c6a15b' },
]
export const PRICE_RANGES = [
  { id: 'p1', name: 'Dưới 500.000₫', min: 0, max: 500000 },
  { id: 'p2', name: '500.000₫ – 1.000.000₫', min: 500000, max: 1000000 },
  { id: 'p3', name: '1.000.000₫ – 2.000.000₫', min: 1000000, max: 2000000 },
  { id: 'p4', name: 'Trên 2.000.000₫', min: 2000000, max: Infinity },
]
export const PROVINCES = ['TP. Đà Nẵng', 'TP. Huế', 'Quảng Ngãi', 'Quảng Trị', 'Gia Lai', 'TP. Hồ Chí Minh', 'TP. Hà Nội', 'Khác']
export const PAY_INFO: Record<string, { name: string; desc: string; logo: string; color: string }> = {
  vnpay: { name: 'VNPAY', desc: 'Thẻ ATM nội địa, QR ngân hàng, Internet Banking', logo: 'VNPAY', color: '#005baa' },
  momo: { name: 'Ví MoMo', desc: 'Quét mã hoặc mở ứng dụng MoMo', logo: 'MoMo', color: '#a50064' },
  zalopay: { name: 'ZaloPay', desc: 'Thanh toán qua ứng dụng ZaloPay', logo: 'ZaloPay', color: '#0068ff' },
  card: { name: 'Thẻ quốc tế', desc: 'Visa, Mastercard, JCB – qua cổng VNPAY', logo: 'VISA', color: '#1a1f71' },
  bank: { name: 'Chuyển khoản ngân hàng (VietQR)', desc: 'Quét mã QR – xác nhận tự động', logo: 'VietQR', color: '#2c5446' },
  deposit: { name: 'Đặt cọc', desc: 'Dành cho đơn công trình – thanh toán phần còn lại khi nhận hàng', logo: 'Cọc', color: '#a8714a' },
  cod: { name: 'Thanh toán khi nhận hàng (COD)', desc: 'Kiểm tra hàng rồi thanh toán', logo: 'COD', color: '#555' },
}
export const ORDER_STATUS_VI: Record<string, string> = {
  pending_payment: 'Chờ thanh toán', deposit_paid: 'Đã đặt cọc', paid: 'Đã thanh toán', pending_confirm: 'Chờ xác nhận',
  processing: 'Đang chuẩn bị hàng', shipping: 'Đang giao', completed: 'Hoàn tất', failed: 'Thanh toán thất bại', cancelled: 'Đã hủy',
}
