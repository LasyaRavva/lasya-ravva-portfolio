import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import ProjectMedia from './ProjectMedia.jsx'

export default function ProjectCard({ project, featured = false, index = 0 }) {
  const reduce = useReducedMotion()
  return (
    <motion.article
      initial={reduce ? false : { opacity: 1, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.16), ease: 'easeOut' }}
      className={`group overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/50 motion-reduce:transform-none ${featured ? 'grid lg:grid-cols-[1.2fr_0.8fr]' : 'flex flex-col'}`}
    >
      <ProjectMedia project={project} loading={featured ? 'eager' : 'lazy'} className={featured ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[360px]' : 'aspect-[16/9]'} />
      <div className={`flex flex-1 flex-col ${featured ? 'p-5 sm:p-8 lg:p-10' : 'p-4 sm:p-6'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-accent-soft">{project.categories[0]}</span>
          <span className="text-xs text-muted">{project.label}</span>
        </div>
        <h2 className={`mt-4 font-display font-extrabold tracking-tight ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
          <Link to={`/work/${project.slug}`} className="hover:text-accent-soft focus-visible:rounded">{project.name}</Link>
        </h2>
        <p className={`mt-3 line-clamp-2 leading-relaxed text-muted lg:line-clamp-none ${featured ? 'max-w-xl' : 'text-sm'}`}>{project.cardSummary || project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2" aria-label="Technologies">
          {project.stack.slice(0, featured ? 5 : 4).map((item, stackIndex) => <li key={item} className={`rounded-md bg-base px-2.5 py-1 text-xs text-muted ${stackIndex >= 2 ? 'hidden sm:inline-flex' : ''}`}>{item}</li>)}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          <Link to={`/work/${project.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-soft hover:text-ink">
            View Case Study<ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-ink" aria-label={`Open ${project.name} live site in a new tab`}>Live Site<ExternalLink aria-hidden className="h-3.5 w-3.5" /></a>}
        </div>
      </div>
    </motion.article>
  )
}
