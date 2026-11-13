import { Crumbs } from '@/components/Crumbs'
import { fmt } from '@/components/format'
import { getSettings } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'Chính sách & Hỗ trợ' }

export default async function PolicyPage() {
  const s = await getSettings()
  return (
    <>
      <div className="container page-head"><Crumbs items={[['Chính sách']]} /><h1 className="display h1">Chính sách & Hỗ trợ</h1></div>
      <div className="container policy">
        <h3 id="van-chuyen">Vận chuyển & lắp đặt</h3>
        <p>Giao trong 24h nội thành Đà Nẵng. Miễn phí vận chuyển cho đơn từ {fmt(s.freeShipThreshold ?? 5000000)} (dưới mức này phí {fmt(s.innerCityFee ?? 150000)}). Đơn tỉnh/thành khác giao qua đối tác vận tải, phí từ {fmt(s.provinceFee ?? 450000)}.</p>
        <h3 id="doi-tra">Đổi trả</h3><ul><li>Đổi trả trong 7 ngày với sản phẩm còn nguyên đai, kiện.</li><li>Không áp dụng với hàng cắt theo yêu cầu và đá slab đã gia công.</li></ul>
        <h3 id="bao-hanh">Bảo hành</h3><p>Bảo hành chính hãng theo từng sản phẩm, thời hạn ghi rõ tại trang chi tiết.</p>
        <h3 id="thanh-toan">Thanh toán</h3><ul>
          <li>VNPAY (ATM nội địa, QR ngân hàng), Ví MoMo, ZaloPay</li><li>Thẻ quốc tế Visa / Mastercard / JCB</li><li>Chuyển khoản qua VietQR – xác nhận tự động</li>
          <li>Thanh toán khi nhận hàng (COD) cho đơn dưới {fmt(s.codLimit ?? 20000000)}, hoặc đặt cọc {s.depositPercent ?? 30}% với đơn công trình</li></ul>
        <h3 id="bao-mat">Bảo mật thông tin</h3><p>Thông tin khách hàng chỉ dùng để xử lý đơn hàng và tư vấn; không chia sẻ cho bên thứ ba ngoài đơn vị vận chuyển và cổng thanh toán. Website không lưu thông tin thẻ thanh toán.</p>
        <p className="muted" style={{ marginTop: 32 }}>* Nội dung mẫu – doanh nghiệp cần xác nhận trước khi công bố.</p>
      </div>
    </>
  )
}
