import { Crumbs } from '@/components/Crumbs'
import { ContactForm } from '@/components/Forms'
import { Icon } from '@/components/Sprite'
import { getSettings } from '@/lib/data'

export const revalidate = 60
export const metadata = { title: 'Liên hệ & Showroom', description: 'Showroom GreenHabitat tại 267 Thái Văn Lung, Hòa Xuân, Đà Nẵng.' }

export default async function ContactPage() {
  const s = await getSettings()
  return (
    <>
      <div className="container page-head"><Crumbs items={[['Liên hệ']]} /><h1 className="display h1">Liên hệ</h1><p className="lead">Gửi yêu cầu, chúng tôi phản hồi trong vòng 2 giờ làm việc.</p></div>
      <div className="container contact">
        <div>
          <ul className="info-list" style={{ marginTop: 0 }}>
            <li><Icon name="pin" /><div><b>Showroom & kho</b><span>{s.address}</span></div></li>
            {(s.hotline || s.zalo) && <li><Icon name="phone" /><div><b>Hotline / Zalo</b><span>{[s.hotline, s.zalo].filter(Boolean).join(' · ')}</span></div></li>}
            {s.email && <li><Icon name="mail" /><div><b>Email</b><span>{s.email}</span></div></li>}
            <li><Icon name="clock" /><div><b>Giờ làm việc</b><span>{s.hours}</span></div></li>
          </ul>
          {s.mapEmbed && <iframe className="map" style={{ borderRadius: 'var(--r-lg)', minHeight: 340 }} title="Bản đồ" src={s.mapEmbed} loading="lazy" />}
        </div>
        <ContactForm />
      </div>
    </>
  )
}
