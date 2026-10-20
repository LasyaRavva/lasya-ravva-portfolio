import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { projects } from '../data/projects.js'
import usePageMeta from '../utils/usePageMeta.js'
import ProjectMedia from '../components/work/ProjectMedia.jsx'

function CaseSection({ number, title, children }) {
  const reduce = useReducedMotion()
  return (
    <motion.section
      initial={reduce ? false : { opacity: 1, y: 6 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="grid gap-3 border-t border-line py-7 sm:grid-cols-[130px_1fr] sm:gap-8 sm:py-9"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-soft">{number} — {title}</p>
      <div className="min-w-0">{children}</div>
    </motion.section>
  )
}

function Fact({ label, value }) {
  return <div><dt className="text-xs font-bold uppercase tracking-wider text-muted">{label}</dt><dd className="mt-2 text-sm font-semibold leading-relaxed">{value}</dd></div>
}

function isConfirmed(value) {
  return typeof value === 'string' && value.length > 0
}

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const index = projects.findIndex((item) => item.slug === slug)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const hasProblem = isConfirmed(project?.problem)
  const problemNumber = 3
  const featuresNumber = problemNumber + Number(hasProblem) + 1
  const technologyNumber = featuresNumber + 1
  const linksNumber = technologyNumber + 1

  usePageMeta(
    project ? `${project.name} | Selected Work by Lasya Ravva` : 'Selected Work | Lasya Ravva',
    project?.summary || 'Selected web development projects by Lasya Ravva.',
  )

  if (!project) return <Navigate to="/work" replace />

  return (
    <>
      <section className="container-x pt-7 sm:pt-14">
        <Link to="/work" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft aria-hidden className="h-4 w-4" />Back to selected work</Link>
        <div className="mt-6 max-w-4xl sm:mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">{project.categories.join(' · ')}<span className="mx-2 text-muted" aria-hidden="true">/</span><span className="text-muted">{project.label}</span></p>
          <h1 className="mt-3 break-words font-display text-3xl font-extrabold tracking-tight min-[375px]:text-4xl sm:text-5xl">{project.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">{project.summary}</p>
        </div>
        <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface sm:mt-9">
          <ProjectMedia project={project} className="aspect-[16/9]" loading="eager" />
          <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">{project.video ? 'The preview plays while visible. Use the on-screen control to pause it; the supplied screenshot remains available as a fallback.' : `Project screenshot for ${project.name}.`}</figcaption>
        </figure>
      </section>

      <div className="container-x py-8 sm:py-12">
        <CaseSection number="01" title="Project context">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Category" value={project.categories.join(', ')} />
            {isConfirmed(project.type) && <Fact label="Project type" value={project.type} />}
            {isConfirmed(project.role) && <Fact label="My role" value={project.role} />}
          </dl>
        </CaseSection>

        <CaseSection number="02" title="Project overview">
          <p className="max-w-3xl leading-relaxed text-muted">{project.description}</p>
        </CaseSection>

        <CaseSection number="03" title="My contribution">
          <p className="max-w-3xl leading-relaxed text-muted">{project.contribution || project.approach}</p>
        </CaseSection>

        {hasProblem && <CaseSection number="04" title="Project goal"><p className="max-w-3xl leading-relaxed text-muted">{project.problem}</p></CaseSection>}

        <CaseSection number={String(featuresNumber).padStart(2, '0')} title="What the project includes">
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => <li key={feature} className="rounded-xl border border-line bg-surface p-4 text-sm font-medium">{feature}</li>)}
          </ul>
        </CaseSection>

        <CaseSection number={String(technologyNumber).padStart(2, '0')} title="Technologies">
          <ul className="flex flex-wrap gap-2" aria-label="Technologies">{project.stack.map((technology) => <li key={technology} className="rounded-md bg-surface px-3 py-1.5 text-sm text-muted">{technology}</li>)}</ul>
        </CaseSection>

        <CaseSection number={String(linksNumber).padStart(2, '0')} title="Project links">
          <div className="flex flex-wrap gap-3">
            {project.live && <a href={project.live} target="_blank" rel="noreferrer" className="btn btn-primary">Live Demo<ExternalLink aria-hidden className="h-4 w-4" /></a>}
            {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost">GitHub<Github aria-hidden className="h-4 w-4" /></a>}
          </div>
        </CaseSection>

        <nav aria-label="Other case studies" className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          <Link to={`/work/${previous.slug}`} className="min-h-20 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"><span className="text-xs font-bold uppercase tracking-wider text-muted">Previous project</span><span className="mt-2 flex items-center gap-2 font-display font-bold"><ArrowLeft aria-hidden className="h-4 w-4 text-accent-soft" />{previous.name}</span></Link>
          <Link to={`/work/${next.slug}`} className="min-h-20 rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:border-accent/50"><span className="text-xs font-bold uppercase tracking-wider text-muted">Next project</span><span className="mt-2 flex items-center justify-end gap-2 font-display font-bold">{next.name}<ArrowRight aria-hidden className="h-4 w-4 text-accent-soft" /></span></Link>
        </nav>
      </div>

      <section className="container-x pb-16 sm:pb-20">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">Planning a similar project?</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">Tell me what you're building or what you need improved, and we can work out a suitable scope.</p>
          <Link to="/contact" className="btn btn-primary mt-6">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  )
}
