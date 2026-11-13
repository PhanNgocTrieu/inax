import { Crumbs } from '@/components/Crumbs'
import { Icon } from '@/components/Sprite'

export const metadata = { title: 'Tra cứu đơn hàng' }

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ err?: string }> }) {
  const { err } = await searchParams
  return (
    <>
      <div className="container page-head"><Crumbs items={[['Tra cứu đơn hàng']]} /><h1 className="display h1">Tra cứu đơn hàng</h1>
        <p className="lead">Nhập mã đơn và số điện thoại đặt hàng để xem trạng thái thanh toán & giao hàng.</p></div>
      <div className="container auth">
        <form className="contact__card" action="/tra-cuu" method="get">
          <div className="form-grid">
            <label className="field full">Mã đơn hàng<input name="code" required placeholder="VD: GH2611131234" /></label>
            <label className="field full">Số điện thoại<input name="phone" type="tel" required /></label>
          </div>
          {err && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>Không tìm thấy đơn hàng khớp với thông tin đã nhập.</p>}
          <button className="btn btn--primary btn--block" style={{ marginTop: 20 }}>Tra cứu <Icon name="arrow" /></button>
        </form>
        <div className="contact__card">
          <h3 className="display h3" style={{ marginBottom: 12 }}>Tài khoản nhà thầu & đại lý</h3>
          <p className="muted">Tài khoản với bảng giá riêng, lịch sử đơn hàng và công nợ sẽ ra mắt ở giai đoạn tiếp theo. Liên hệ để được cấp giá dự án ngay hôm nay.</p>
        </div>
      </div>
    </>
  )
}
