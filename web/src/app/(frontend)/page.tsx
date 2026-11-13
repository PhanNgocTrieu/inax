import Link from 'next/link'
import { HomeTabs } from '@/components/ProductCard'
import { QuoteButton } from '@/components/QuoteModal'
import { Icon } from '@/components/Sprite'
import { ProjectCard } from '@/components/ProjectCard'
import { ROOMS } from '@/lib/constants'
import { getCategories, getProducts, getProjects, getSettings } from '@/lib/data'
import { bgImage, texture, type TexSpec } from '@/lib/texture'

export const revalidate = 60

const T = {
  calacatta: { t: 'marble', base: '#f6f3ee', vein: '#b9a27a', seed: 12 }, oak: { t: 'wood', base: '#d9b98f', dark: '#a8835a', seed: 9 },
  zellige: { t: 'tile', colors: ['#2f5d50', '#3a6b5d', '#264f44', '#41766a', '#305f53'], w: 50, h: 100, grout: '#e6e0d5', gloss: true, seed: 2 },
  terrazzo: { t: 'terrazzo', base: '#ebe4d8', chips: ['#c2ad91', '#8b7e6c', '#d9cfbf', '#b5835a', '#f8f6f1'], seed: 4 },
  micro: { t: 'concrete', base: '#d4c6b2', seed: 5 }, trav: { t: 'travertine', base: '#e4d4bb', dark: '#b89d79', seed: 13 },
} satisfies Record<string, TexSpec>
const bg = (t: TexSpec) => ({ backgroundImage: texture(t) })

export default async function Home() {
  const [cats, products, projects, s] = await Promise.all([getCategories(), getProducts(), getProjects(3), getSettings()])
  const countBy = (slug: string) => products.filter((p) => p.cat.slug === slug).length
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="reveal">
            <p className="eyebrow">Vật liệu xây dựng & Trang trí nội thất · Đà Nẵng</p>
            <h1 className="display h1">Vật liệu tinh tuyển cho <em className="accent">không gian sống</em> bền vững.</h1>
            <p className="lead">Gạch ốp lát, đá tự nhiên, sàn gỗ, thiết bị vệ sinh và vật liệu hoàn thiện – chính hãng, tư vấn tận nơi, giao nhanh khắp miền Trung.</p>
            <div className="hero__ctas">
              <Link href="/san-pham" className="btn btn--primary">Khám phá sản phẩm <Icon name="arrow" /></Link>
              <QuoteButton ctx={{ mode: 'quote' }}>Nhận báo giá công trình</QuoteButton>
            </div>
            <div className="hero__stats">
              <div><b>2.000+</b><span>Mẫu vật liệu</span></div><div><b>350+</b><span>Công trình hoàn thiện</span></div><div><b>24h</b><span>Giao hàng nội thành</span></div>
            </div>
          </div>
          <div className="moodboard reveal" aria-hidden="true">
            <div className="mb mb--1" style={bg(T.calacatta)}><small>Calacatta Gold</small></div>
            <div className="mb mb--2" style={bg(T.oak)}><small>Sồi Trắng</small></div>
            <div className="mb mb--3" style={bg(T.zellige)}><small>Zellige</small></div>
            <div className="mb mb--4" style={bg(T.terrazzo)}><small>Terrazzo</small></div>
            <div className="mb mb--5" style={bg(T.micro)} />
            <div className="hero__tag"><span className="dot" style={bg(T.trav)} /><div><b>Bộ sưu tập Terra 2026</b>Tông đất · Bề mặt tự nhiên</div></div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container trust__grid">
          <div className="trust__item"><Icon name="shield" /><div><b>100% chính hãng</b><span>Đầy đủ CO/CQ, hóa đơn VAT</span></div></div>
          <div className="trust__item"><Icon name="truck" /><div><b>Giao nhanh 24h</b><span>Miễn phí nội thành từ {((s.freeShipThreshold ?? 5e6) / 1e6).toLocaleString('vi-VN')} triệu</span></div></div>
          <div className="trust__item"><Icon name="swatch" /><div><b>Đặt mẫu miễn phí</b><span>Xem vật liệu thật trước khi mua</span></div></div>
          <div className="trust__item"><Icon name="pencil" /><div><b>Tư vấn thiết kế</b><span>Phối vật liệu cùng kiến trúc sư</span></div></div>
        </div>
      </section>

      <section className="section"><div className="container">
        <div className="section__head reveal">
          <div><p className="eyebrow">Danh mục sản phẩm</p><h2 className="display h2">Mọi lớp hoàn thiện cho ngôi nhà của bạn</h2></div>
          <Link href="/san-pham" className="link">Xem tất cả sản phẩm <Icon name="arrow" /></Link>
        </div>
        <div className="cat-grid">{cats.map((c) => (
          <Link key={c.id} href={`/san-pham?cat=${c.slug}`} className="cat-card reveal">
            <div className="bg" style={{ backgroundImage: bgImage(c.img, c.tex) }} />
            <span className="count">{countBy(c.slug)} sản phẩm</span>
            <div className="cat-card__body"><div><h3>{c.name}</h3><p>{c.short}</p></div><span className="arrow"><Icon name="arrow" /></span></div>
          </Link>))}
        </div>
      </div></section>

      <section className="section section--white"><div className="container">
        <div className="section__head reveal"><div><p className="eyebrow">Mua theo không gian</p><h2 className="display h2">Bắt đầu từ căn phòng bạn đang hình dung</h2></div></div>
        <div className="rooms">{ROOMS.map((r) => (
          <Link key={r.id} className="room reveal" href={`/san-pham?room=${r.id}`}><div className="room__img" style={bg(r.tex)} /><h3>{r.name} <Icon name="arrow" /></h3><p>{r.desc}</p></Link>))}
        </div>
      </div></section>

      <section className="section"><div className="container"><HomeTabs products={products} /></div></section>

      <section className="editorial">
        <div className="editorial__img reveal" style={bg(T.trav)}><div className="chip"><b>Travertine Roma</b> · Honed · 60×120 cm</div></div>
        <div className="editorial__body">
          <p className="eyebrow eyebrow--light">Bộ sưu tập 2026</p>
          <h2 className="display h2">Terra – vẻ đẹp mộc của đất, đá và gỗ.</h2>
          <p>Bảng vật liệu tông ấm lấy cảm hứng từ bờ biển miền Trung: travertine rỗ tự nhiên, gỗ sồi lau dầu, microcement màu cát và gạch zellige tráng men thủ công.</p>
          <div className="swatches">{[T.trav, T.oak, T.micro, T.zellige, T.terrazzo].map((t, i) => <span key={i} style={bg(t)} />)}</div>
          <div><Link href="/san-pham" className="btn btn--light">Xem bộ sưu tập <Icon name="arrow" /></Link></div>
        </div>
      </section>

      <section className="section"><div className="container">
        <div className="section__head reveal">
          <div><p className="eyebrow">Quy trình làm việc</p><h2 className="display h2">Từ ý tưởng đến công trình hoàn thiện</h2></div>
          <QuoteButton ctx={{ mode: 'quote' }} className="btn btn--primary">Bắt đầu với một báo giá <Icon name="arrow" /></QuoteButton>
        </div>
        <div className="steps">
          <div className="step reveal"><Icon name="chat" /><h3>Tư vấn</h3><p>Chuyên viên lắng nghe nhu cầu, phong cách và ngân sách của bạn – tại showroom hoặc tại công trình.</p></div>
          <div className="step reveal"><Icon name="swatch" /><h3>Đặt mẫu</h3><p>Nhận mẫu vật liệu thật miễn phí để so màu, so bề mặt trong ánh sáng thực tế.</p></div>
          <div className="step reveal"><Icon name="ruler" /><h3>Bóc tách & báo giá</h3><p>Đo đạc, tính khối lượng và hao hụt, báo giá chi tiết trong 24 giờ.</p></div>
          <div className="step reveal"><Icon name="truck" /><h3>Giao hàng & thi công</h3><p>Giao đúng tiến độ, hỗ trợ đội thi công và bảo hành chính hãng.</p></div>
        </div>
      </div></section>

      {projects.length > 0 && <section className="section section--sand"><div className="container">
        <div className="section__head reveal">
          <div><p className="eyebrow">Dự án tiêu biểu</p><h2 className="display h2">Vật liệu của chúng tôi trong những công trình thật</h2></div>
          <Link href="/du-an" className="link">Tất cả dự án <Icon name="arrow" /></Link>
        </div>
        <div className="proj-grid">{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </div></section>}

      {(s.brands?.length ?? 0) > 0 && <section className="section--tight section--white"><div className="container">
        <p className="eyebrow reveal" style={{ textAlign: 'center', marginBottom: 28 }}>Thương hiệu phân phối</p>
        <div className="brands reveal">{s.brands!.map((b) => <span key={b}>{b}</span>)}</div>
      </div></section>}

      <section className="section"><div className="container">
        <div className="showroom reveal">
          <div className="showroom__body">
            <p className="eyebrow">Showroom</p>
            <h2 className="display h2">Ghé thăm không gian trưng bày tại Đà Nẵng</h2>
            <p className="muted">Trải nghiệm trực tiếp hàng trăm mẫu vật liệu được dàn dựng theo từng không gian thực tế.</p>
            <ul className="info-list">
              <li><Icon name="pin" /><div><b>Địa chỉ</b><span>{s.address}</span></div></li>
              <li><Icon name="clock" /><div><b>Giờ mở cửa</b><span>{s.hours}</span></div></li>
              {s.hotline && <li><Icon name="phone" /><div><b>Hotline</b><span>{s.hotline}</span></div></li>}
            </ul>
            <div className="hero__ctas" style={{ marginTop: 0 }}>
              {s.mapLink && <a className="btn btn--primary" href={s.mapLink} target="_blank" rel="noopener">Chỉ đường <Icon name="arrow" /></a>}
              <QuoteButton ctx={{ mode: 'visit' }}>Đặt lịch tham quan</QuoteButton>
            </div>
          </div>
          {s.mapEmbed && <iframe className="map" title="Bản đồ showroom GreenHabitat" src={s.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
        </div>
      </div></section>
    </>
  )
}
