import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import { services } from '../data/services.js'
import { projects } from '../data/projects.js'
import { principles } from '../data/about.js'
import ProjectMedia from '../components/work/ProjectMedia.jsx'
import usePageMeta from '../utils/usePageMeta.js'

export default function Home() {
  usePageMeta(
    'Lasya Ravva | Freelance Web Developer',
    'Freelance web developer building responsive business websites, landing pages and web applications for local businesses and startups.',
  )

  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="container-x py-10 sm:py-20" aria-labelledby="home-services-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Services</p>
            <h2 id="home-services-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Practical web help for your next step.</h2>
          </div>
          <Link to="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-soft hover:text-ink">Explore all services<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
        <div className="mt-7 grid gap-3 min-[360px]:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article key={service.number} className="rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/50 sm:p-5">
              <p className="text-xs font-bold tracking-[0.14em] text-accent-soft">{service.number}</p>
              <h3 className="mt-3 font-display text-lg font-bold">{service.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{service.description}</p>
              <Link to={`/services#service-${service.number}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-soft hover:text-ink">Explore service<ArrowRight aria-hidden className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface/35" aria-labelledby="home-work-title">
        <div className="container-x py-10 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Selected work</p>
              <h2 id="home-work-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">A few projects, built for real workflows.</h2>
            </div>
            <Link to="/work" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-soft hover:text-ink">View all projects<ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {projects.slice(1, 3).map((project) => (
              <article key={project.slug} className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50">
                <ProjectMedia project={project} className="aspect-[16/9]" />
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold text-muted">{project.label}</p>
                  <h3 className="mt-2 font-display text-xl font-extrabold"><Link to={`/work/${project.slug}`} className="hover:text-accent-soft">{project.name}</Link></h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{project.cardSummary || project.summary}</p>
                  <Link to={`/work/${project.slug}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-soft hover:text-ink">View case study<ArrowRight aria-hidden className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-10 sm:py-16" aria-labelledby="home-approach-title">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">My approach</p>
          <h2 id="home-approach-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Clear decisions. Useful functionality. Thoughtful delivery.</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
          {principles.map(([number, title, description]) => (
            <article key={number} className="border-t border-line pt-4 sm:pt-5">
              <p className="font-display text-sm font-bold text-accent-soft">{number}</p>
              <h3 className="mt-2 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x py-10 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:p-14">
          <div className="relative max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Let’s work together</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Have a website or web app in mind?</h2>
            <p className="mt-4 leading-relaxed text-muted">Tell me what you want to build or improve. We can work out a clear scope and a practical next step.</p>
            <div className="mt-6 flex flex-col gap-3 min-[380px]:flex-row">
              <Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link>
              <Link to="/about" className="btn btn-ghost">About Me</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
