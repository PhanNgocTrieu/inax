import { Crumbs } from '@/components/Crumbs'
import { ProjectCard } from '@/components/ProjectCard'
import { QuoteButton } from '@/components/QuoteModal'
import { Icon } from '@/components/Sprite'
import { getProjects } from '@/lib/data'
import { bgImage } from '@/lib/texture'

export const revalidate = 60
export const metadata = { title: 'Dự án tiêu biểu', description: 'Các công trình nhà ở, khách sạn, F&B, văn phòng sử dụng vật liệu GreenHabitat.' }

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <>
      <section className="page-banner"><div className="bg" style={{ backgroundImage: bgImage(projects[0]?.img, projects[0]?.tex) }} />
        <div className="container"><Crumbs items={[['Dự án']]} />
          <h1 className="display h1" style={{ margin: '18px 0 12px' }}>Dự án tiêu biểu</h1>
          <p className="lead">Nhà ở, khách sạn, F&B và văn phòng – nơi vật liệu GreenHabitat góp phần tạo nên không gian.</p></div>
      </section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <div className="proj-grid">{projects.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </div></section>
      <section className="section section--green"><div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div><p className="eyebrow eyebrow--light">Dành cho nhà thầu & kiến trúc sư</p>
          <h2 className="display h2" style={{ color: '#fff', marginTop: 12, maxWidth: '20ch' }}>Chính sách giá dự án, hỗ trợ mẫu & bóc tách khối lượng.</h2></div>
        <QuoteButton ctx={{ mode: 'quote' }} className="btn btn--light">Đăng ký đối tác <Icon name="arrow" /></QuoteButton>
      </div></section>
    </>
  )
}
