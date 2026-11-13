import Link from 'next/link'
export default function NotFound() {
  return <div className="container empty" style={{ padding: '120px 20px' }}><h3>Không tìm thấy trang</h3><p>Trang bạn tìm có thể đã được di chuyển.</p>
    <p style={{ marginTop: 24 }}><Link className="btn btn--primary" href="/">Về trang chủ</Link></p></div>
}
