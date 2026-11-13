import { Crumbs } from '@/components/Crumbs'
import { Icon } from '@/components/Sprite'
import { getSettings } from '@/lib/data'
import { texture } from '@/lib/texture'

export const revalidate = 60
export const metadata = { title: 'Về chúng tôi', description: 'GreenHabitat – thương hiệu của Công ty TNHH Thương mại TNT Thịnh Phát, cung cấp vật liệu xây dựng & trang trí nội thất tại Đà Nẵng.' }

export default async function AboutPage() {
  const s = await getSettings()
  return (
    <>
      <section className="page-banner"><div className="bg" style={{ backgroundImage: texture({ t: 'wood', base: '#c79b6d', dark: '#8a5f3a', seed: 2 }) }} />
        <div className="container"><Crumbs items={[['Về chúng tôi']]} />
          <h1 className="display h1" style={{ margin: '18px 0 12px' }}>Về GreenHabitat</h1><p className="lead">{s.legalName}</p></div>
      </section>
      <section className="section"><div className="container about-intro">
        <div className="reveal"><p className="eyebrow">Câu chuyện của chúng tôi</p>
          <h2 className="display h2" style={{ margin: '14px 0 24px' }}>Kiến tạo những “môi trường sống xanh” từ từng lớp vật liệu.</h2>
          <p className="lead" style={{ marginBottom: 18 }}>GreenHabitat là thương hiệu của Công ty TNHH Thương mại TNT Thịnh Phát – đơn vị cung cấp vật liệu xây dựng và trang trí nội thất tại Đà Nẵng.</p>
          <p className="muted">Chúng tôi tin rằng một ngôi nhà đẹp bắt đầu từ vật liệu tốt: bền bỉ với khí hậu miền Trung, an toàn cho sức khỏe và hài hòa với thiên nhiên. Mỗi sản phẩm đều được tuyển chọn kỹ lưỡng, có nguồn gốc rõ ràng và được tư vấn bởi đội ngũ am hiểu kỹ thuật thi công.</p>
        </div>
        <div className="img reveal" style={{ backgroundImage: texture({ t: 'travertine', base: '#e4d4bb', dark: '#b89d79', seed: 13 }) }} />
      </div></section>
      <section className="section section--green"><div className="container"><div className="stats">
        <div><b>2.000+</b><span>Mẫu vật liệu</span></div><div><b>350+</b><span>Công trình đã cung cấp</span></div>
        <div><b>{s.brands?.length || 8}+</b><span>Thương hiệu đối tác</span></div><div><b>24h</b><span>Giao hàng nội thành</span></div>
      </div></div></section>
      <section className="section"><div className="container">
        <div className="section__head"><div><p className="eyebrow">Giá trị cốt lõi</p><h2 className="display h2">Điều chúng tôi cam kết</h2></div></div>
        <div className="values">
          <div className="value reveal"><Icon name="shield" /><h3>Chính hãng & minh bạch</h3><p>Nguồn gốc rõ ràng, chứng từ CO/CQ đầy đủ, giá niêm yết công khai.</p></div>
          <div className="value reveal"><Icon name="leaf" /><h3>Vật liệu bền vững</h3><p>Ưu tiên sản phẩm phát thải thấp, an toàn sức khỏe và có tuổi thọ cao.</p></div>
          <div className="value reveal"><Icon name="chat" /><h3>Đồng hành tận tâm</h3><p>Tư vấn từ khâu chọn mẫu, bóc tách khối lượng đến hỗ trợ kỹ thuật thi công.</p></div>
        </div>
      </div></section>
    </>
  )
}
