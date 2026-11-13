import Link from 'next/link'
export const metadata = { title: 'Có lỗi xảy ra', robots: { index: false } }
export default function Page() {
  return <div className="container empty" style={{ padding: '120px 20px' }}><h3>Không xác thực được giao dịch</h3>
    <p>Vui lòng liên hệ hotline kèm mã đơn hàng để được hỗ trợ. Tiền (nếu đã trừ) sẽ được đối soát và hoàn lại.</p>
    <p style={{ marginTop: 24 }}><Link className="btn btn--primary" href="/tai-khoan">Tra cứu đơn hàng</Link></p></div>
}
