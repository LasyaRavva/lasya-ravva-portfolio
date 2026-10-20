import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import ProjectCard from '../components/work/ProjectCard.jsx'
import SelectDropdown from '../components/ui/SelectDropdown.jsx'
import { projects } from '../data/projects.js'
import usePageMeta from '../utils/usePageMeta.js'

const filters = ['All', 'Business Websites', 'Web Applications', 'E-commerce', 'Booking', 'UI / Frontend']
const focusPoints = ['Responsive interfaces', 'Practical functionality', 'Modern frontend development', 'Full-stack capability']

export default function Work() {
  const [active, setActive] = useState('All')
  const reduce = useReducedMotion()
  const featured = projects[0]
  const visibleProjects = useMemo(
    () => projects.filter((project) => project !== featured && (active === 'All' || project.categories.includes(active))),
    [active, featured],
  )

  usePageMeta('Selected Web Development Work | Lasya Ravva', 'Explore selected web development projects by Lasya Ravva, including responsive websites, React applications, booking platforms and e-commerce experiences.')

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <motion.div
          initial={reduce ? false : { opacity: 1, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="container-x py-9 sm:py-20 lg:py-24"
        >
          <p className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted">Selected Work</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">Projects Built to Solve Real Problems.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">A selection of web projects demonstrating responsive design, modern interfaces, frontend development, API integration and full-stack functionality.</p>
          <p className="mt-4 text-sm font-bold text-accent-soft sm:mt-6">{projects.length} Projects</p>
        </motion.div>
      </section>

      <section className="container-x pb-8 sm:pb-20" aria-label="Project portfolio">
        <SelectDropdown
          ariaLabel="Filter projects by category"
          listLabel="Filter projects by category"
          value={active}
          onValueChange={setActive}
          options={filters}
          className="mb-4 md:hidden"
          triggerClassName="min-h-11 rounded-full border-accent/60 bg-surface text-sm font-semibold"
        />
        <div role="group" aria-label="Filter projects by category" className="hidden flex-wrap gap-2 pb-4 md:flex">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
              className={`min-h-11 rounded-full border px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline sm:px-4 ${active === filter ? 'border-accent-button bg-accent-button text-white' : 'border-line bg-surface text-muted hover:border-muted hover:text-ink'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {visibleProjects.length + Number(active === 'All' || featured.categories.includes(active))} projects shown for {active}.
        </p>

        {(active === 'All' || featured.categories.includes(active)) && (
          <div className="mt-5">
            <ProjectCard project={featured} featured index={0} />
          </div>
        )}

        {visibleProjects.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
            {visibleProjects.map((project, i) => <ProjectCard key={project.slug} project={project} index={i + 1} />)}
          </div>
        ) : active !== 'All' && !featured.categories.includes(active) ? (
          <div className="mt-5 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="font-display text-lg font-bold">No projects in this category yet.</p>
            <button type="button" onClick={() => setActive('All')} className="mt-3 text-sm font-bold text-accent-soft hover:text-ink">Show all projects</button>
          </div>
        ) : null}
      </section>

      <section className="border-y border-line bg-surface/35">
        <div className="container-x grid gap-5 py-8 sm:gap-8 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">How I approach the work</p>
            <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight sm:text-3xl">Different projects. One focus: building useful web experiences.</h2>
          </div>
          <ul className="grid gap-2 min-[430px]:grid-cols-2 sm:gap-3">
            {focusPoints.map((point) => <li key={point} className="flex items-center gap-3 rounded-xl border border-line bg-base/70 p-3 text-sm font-semibold sm:p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15"><Check aria-hidden className="h-4 w-4 text-accent-soft" /></span>{point}</li>)}
          </ul>
        </div>
      </section>

      <section className="container-x py-10 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-10 lg:p-14">
          <div className="relative max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Have a project in mind?</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Want something like this for your business?</h2>
            <p className="mt-4 leading-relaxed text-muted">Tell me what you're building, what you need improved, or where you're stuck. I'll help you figure out the right approach.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link>
              <Link to="/services" className="btn btn-ghost">View Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
