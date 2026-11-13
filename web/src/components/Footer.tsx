import Link from 'next/link'
import type { CatView, PublicSettings } from '@/lib/data'
import { NewsletterForm } from './Forms'
import { Icon } from './Sprite'

export function Footer({ s, cats }: { s: PublicSettings; cats: CatView[] }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cta">
          <div><p className="eyebrow eyebrow--light">Bản tin GreenHabitat</p><h3>Nhận bộ sưu tập mới & ưu đãi dành cho công trình.</h3></div>
          <NewsletterForm />
        </div>
        <div className="footer__grid">
          <div className="footer__brand">
            <Link href="/" className="logo logo--light"><Icon name="leaf" className="logo__mark" /><span className="logo__text"><b>GreenHabitat</b><small>TNT Thịnh Phát</small></span></Link>
            <p>Nhà cung cấp vật liệu xây dựng và trang trí nội thất tại Đà Nẵng. Tuyển chọn vật liệu bền vững, chính hãng cho nhà ở, khách sạn và công trình thương mại.</p>
          </div>
          <div><h4>Sản phẩm</h4><ul>{cats.map((c) => <li key={c.id}><Link href={`/san-pham?cat=${c.slug}`}>{c.name}</Link></li>)}</ul></div>
          <div><h4>Công ty</h4><ul>
            <li><Link href="/gioi-thieu">Về GreenHabitat</Link></li><li><Link href="/du-an">Dự án tiêu biểu</Link></li>
            <li><Link href="/lien-he">Showroom</Link></li></ul></div>
          <div><h4>Hỗ trợ khách hàng</h4><ul>
            <li><Link href="/chinh-sach#doi-tra">Chính sách đổi trả</Link></li><li><Link href="/chinh-sach#van-chuyen">Vận chuyển & lắp đặt</Link></li>
            <li><Link href="/chinh-sach#bao-hanh">Bảo hành</Link></li><li><Link href="/chinh-sach#thanh-toan">Hướng dẫn thanh toán</Link></li>
            <li><Link href="/chinh-sach#bao-mat">Chính sách bảo mật</Link></li></ul></div>
          <div className="footer__contact"><h4>Liên hệ</h4>
            <p><Icon name="pin" /><span>{s.address}</span></p>
            {s.hotline && <p><Icon name="phone" /><span>{s.hotline}</span></p>}
            {s.email && <p><Icon name="mail" /><span>{s.email}</span></p>}
            <p><Icon name="clock" /><span>{s.hours}</span></p>
          </div>
        </div>
        <div className="footer__bottom">
          <div><b>{s.legalName}</b><br />MST: {s.taxCode || 'Đang cập nhật'} · © {new Date().getFullYear()} GreenHabitat. Bảo lưu mọi quyền.</div>
          <div className="paylogos" aria-label="Phương thức thanh toán"><span>VNPAY</span><span>MoMo</span><span>ZaloPay</span><span>VietQR</span><span>VISA</span><span>Mastercard</span></div>
        </div>
      </div>
    </footer>
  )
}
