import type { ProjectView } from '@/lib/data'
import { bgImage } from '@/lib/texture'

export function ProjectCard({ p }: { p: ProjectView }) {
  return (
    <article className="proj reveal">
      <div className="proj__img" style={{ backgroundImage: bgImage(p.img, p.tex) }}>{p.type && <span className="badge">{p.type}</span>}</div>
      <h3>{p.name}</h3><p>{p.materials}</p>
      <div className="proj__meta">{p.year && <span>{p.year}</span>}{p.area && <span>{p.area}</span>}</div>
    </article>
  )
}
