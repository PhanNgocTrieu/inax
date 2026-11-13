import { Checkout } from '@/components/Checkout'
import { Crumbs } from '@/components/Crumbs'
export const metadata = { title: 'Thanh toán', robots: { index: false } }
export default function Page() {
  return (
    <>
      <div className="container page-head" style={{ paddingBottom: 0 }}>
        <Crumbs items={[['Giỏ hàng', '/gio-hang'], ['Thanh toán']]} />
        <h1 className="display h2" style={{ marginTop: 18 }}>Thanh toán</h1>
        <ol className="stepper"><li className="is-done">Giỏ hàng</li><li className="is-active">Thông tin & thanh toán</li><li>Hoàn tất</li></ol>
      </div>
      <Checkout />
    </>
  )
}
