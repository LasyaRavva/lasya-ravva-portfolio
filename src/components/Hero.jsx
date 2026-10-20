import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects.js'
import { site } from '../data/site.js'
import ProjectMedia from './work/ProjectMedia.jsx'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 1, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }

export default function Hero() {
  const reduce = useReducedMotion()
  const featured = projects[0]

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="container-x relative grid grid-cols-1 items-center gap-9 py-10 sm:gap-12 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
        <motion.div variants={container} initial={reduce ? false : 'hidden'} animate="show" className="min-w-0">
          {site.availableForProjects && <motion.p variants={item} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            Available for freelance projects
          </motion.p>}

          <motion.h1 variants={item} id="hero-title" className="mt-5 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.04em] min-[360px]:text-4xl sm:mt-6 sm:text-6xl">
            Your business deserves a better website. I build it.
          </motion.h1>

          <motion.p variants={item} className="mt-4 max-w-xl text-base font-medium leading-relaxed text-muted sm:mt-6 sm:text-lg">
            I design and develop responsive websites and web apps for local businesses and startups, with a clean interface and features that work.
          </motion.p>

          <motion.div variants={item} className="mt-6 flex flex-col gap-3 min-[380px]:flex-row sm:mt-8">
            <Link to="/contact" className="btn btn-primary">Start a Project</Link>
            <Link to="/work" className="btn btn-ghost">View Work</Link>
          </motion.div>

          <motion.p variants={item} className="mt-6 hidden text-sm text-muted sm:block sm:mt-8">
            Business websites, landing pages, React web apps, website fixes
          </motion.p>
        </motion.div>

        {/* A real project screenshot gives visitors a quick visual proof point. */}
        <motion.div
          initial={reduce ? false : { opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
          className="min-w-0 w-full max-w-3xl justify-self-end overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <ProjectMedia project={featured} className="aspect-[16/9]" loading="eager" />
          <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-soft">Featured project · {featured.label}</p>
              <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl"><Link to={`/work/${featured.slug}`} className="hover:text-accent-soft">{featured.name}</Link></h2>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{featured.summary}</p>
            </div>
            <Link to={`/work/${featured.slug}`} aria-label={`View ${featured.name} case study`} className="mt-2 shrink-0 rounded-sm text-accent-soft hover:text-ink"><ArrowUpRight aria-hidden className="h-5 w-5" /></Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
