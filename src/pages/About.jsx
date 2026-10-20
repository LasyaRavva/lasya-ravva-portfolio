import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Blocks, Code2, Compass, MonitorSmartphone, Plus } from 'lucide-react'
import { aboutFaqs, aboutProcess, capabilities, clientExpectations, focusAreas } from '../data/about.js'
import usePageMeta from '../utils/usePageMeta.js'

const focusIcons = { clarity: Compass, responsive: MonitorSmartphone, function: Code2, maintainable: Blocks }

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      initial={reduce ? false : { opacity: 1, y: 6 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted">{description}</p>}
    </div>
  )
}

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = `about-faq-answer-${index}`
  return (
    <div className="border-b border-line py-5">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left font-semibold focus-visible:rounded">
          <span>{question}</span><Plus aria-hidden className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-45 text-ink' : ''}`} />
        </button>
      </h3>
      <motion.div id={panelId} aria-hidden={!open} initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="overflow-hidden">
        <p className="max-w-2xl pr-10 pt-3 text-sm leading-relaxed text-muted">{answer}</p>
      </motion.div>
    </div>
  )
}

export default function About() {
  const reduce = useReducedMotion()
  usePageMeta('About Lasya | Freelance Web Developer', 'Learn about Lasya, a freelance web developer focused on responsive business websites, modern web interfaces and practical web applications.')

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x py-9 sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
          <Reveal>
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-10 xl:grid-cols-[minmax(0,1fr)_270px] xl:gap-12">
              <div>
                <p className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted">About</p>
                <h1 className="mt-6 max-w-4xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight min-[380px]:text-4xl sm:text-5xl lg:text-6xl">Building the Web With a Focus on People, Products, and Practical Solutions.</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">I'm Lasya, a freelance web developer focused on creating modern, responsive websites and web applications that are clear, useful, and built around real business needs.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link>
                  <Link to="/work" className="btn btn-ghost">View My Work</Link>
                </div>
              </div>
              <motion.figure
                initial={reduce ? false : { opacity: 1, y: 6, scale: 0.99 }}
                animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.12, ease: 'easeOut' }}
                className="mx-auto w-56 overflow-hidden rounded-2xl border border-line bg-surface min-[380px]:w-60 sm:w-60 md:w-[220px] lg:mx-0 lg:w-full"
              >
                <img src="/images/profile/profile-pic.webp" alt="Lasya Ravva, freelance web developer" width="1086" height="1448" loading="eager" decoding="async" className="block aspect-[3/4] h-auto w-full object-cover object-center" />
              </motion.figure>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-8 pt-4 sm:pb-16 sm:pt-12" aria-labelledby="about-intro-title">
        <Reveal delay={0.08}>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/55 p-5 sm:p-8 lg:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-accent-soft sm:text-sm">A little about my approach</p>
                <h2 id="about-intro-title" className="mt-3 max-w-2xl font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">A Developer Who Thinks Beyond the Code.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base">I start with the business goal and what visitors need to do. Then I shape a clear, mobile-friendly experience around those needs, with practical features and communication that keeps progress easy to follow.</p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ['01', 'People first', 'Designed around what visitors need to accomplish.'],
                  ['02', 'Ready for real use', 'Responsive layouts with practical functionality.'],
                  ['03', 'Clear throughout', 'Requirements and progress stay easy to follow.'],
                ].map(([number, title, description]) => (
                  <li key={number} className="flex gap-3 rounded-xl border border-line/80 bg-base/55 p-3 sm:p-4">
                    <span className="pt-0.5 font-display text-sm font-bold text-accent-soft">{number}</span>
                    <div><h3 className="text-sm font-bold sm:text-base">{title}</h3><p className="mt-1 text-[13px] leading-relaxed text-muted sm:text-sm">{description}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-x py-8 sm:py-16 lg:py-20">
        <Reveal><SectionHeading eyebrow="What I focus on" title="Useful by design. Built for real use." /></Reveal>
        <div className="mt-6 grid gap-2 sm:mt-8 sm:gap-4 sm:grid-cols-2">
          {focusAreas.map((area, index) => {
            const Icon = focusIcons[area.icon]
            return <Reveal key={area.number} delay={index * 0.04}><article className="group h-full border-t border-line py-4 transition-colors hover:border-accent/60 sm:py-6"><div className="flex items-center justify-between"><span className="font-display text-sm font-bold text-accent-soft">{area.number}</span><Icon aria-hidden className="h-5 w-5 text-muted transition-colors group-hover:text-accent-soft" /></div><h3 className="mt-3 font-display text-lg font-bold sm:mt-4 sm:text-xl">{area.title}</h3><p className="mt-2 max-w-lg leading-relaxed text-muted">{area.description}</p></article></Reveal>
          })}
        </div>
      </section>

      <section className="border-y border-line bg-surface/35">
        <div className="container-x py-10 sm:py-16 lg:py-20">
          <Reveal><SectionHeading eyebrow="How I work" title="Simple Process. Clear Communication." description="A straightforward sequence keeps decisions visible and helps the work stay aligned with the agreed scope." /></Reveal>
          <ol className="mt-7 grid gap-x-5 gap-y-4 sm:mt-10 sm:gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
            {aboutProcess.map(([number, title, description], index) => <Reveal as="li" key={number} delay={index * 0.04} className="h-full border-t border-line pt-4"><span className="font-display text-sm font-bold text-accent-soft">{number}</span><h3 className="mt-3 font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{description}</p></Reveal>)}
          </ol>
        </div>
      </section>

      <section className="container-x py-8 sm:py-16 lg:py-20">
        <Reveal><SectionHeading eyebrow="Working together" title="What You Can Expect" description="A professional working relationship with clear expectations and decisions grounded in the project’s needs." /></Reveal>
        <details className="mt-5 rounded-xl border border-line bg-surface px-4 lg:hidden">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 py-3 font-semibold marker:hidden focus-visible:rounded">See what working together looks like<span aria-hidden className="text-accent-soft">+</span></summary>
          <ul className="divide-y divide-line pb-2">
            {clientExpectations.map(([title, description]) => <li key={title} className="py-3"><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{description}</p></li>)}
          </ul>
        </details>
        <div className="mt-8 hidden gap-x-6 sm:grid-cols-2 lg:grid">
          {clientExpectations.map(([title, description], index) => <Reveal key={title} delay={index * 0.03} className={index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}><article className="h-full border-t border-line py-5"><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{description}</p></article></Reveal>)}
        </div>
      </section>

      <section className="border-y border-line bg-surface/35">
        <div className="container-x grid gap-5 py-8 sm:gap-8 sm:py-16 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Capabilities</p><h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Tools that support the work.</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">A short overview of the technologies and tools I use across website and application projects.</p></div></Reveal>
          <details className="rounded-xl border border-line bg-base/50 px-4 lg:hidden">
            <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 py-3 font-semibold marker:hidden focus-visible:rounded">Technologies and tools<span aria-hidden className="text-accent-soft">+</span></summary>
            <div className="grid gap-4 pb-4">
              {capabilities.map(([category, skills]) => <div key={category}><h3 className="text-sm font-bold">{category}</h3><ul className="mt-2 flex flex-wrap gap-2">{skills.map((skill) => <li key={skill} className="rounded-full border border-line bg-base/60 px-3 py-1.5 text-[13px] font-medium text-muted">{skill}</li>)}</ul></div>)}
            </div>
          </details>
          <div className="hidden gap-5 sm:grid-cols-2 lg:grid">
            {capabilities.map(([category, skills], index) => <Reveal key={category} delay={index * 0.035}><div className="border-t border-line pt-4"><h3 className="font-display text-sm font-bold">{category}</h3><ul className="mt-3 flex flex-wrap gap-2">{skills.map((skill) => <li key={skill} className="rounded-full border border-line bg-base/60 px-3 py-1.5 text-[13px] font-medium text-muted">{skill}</li>)}</ul></div></Reveal>)}
          </div>
        </div>
      </section>

      <section className="container-x py-8 sm:py-16" aria-labelledby="about-faq-title">
        <Reveal><SectionHeading eyebrow="FAQ" title="A few things clients ask." /></Reveal>
        <h2 id="about-faq-title" className="sr-only">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line sm:mt-8">
          {aboutFaqs.slice(0, 3).map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} index={index} />)}
          <details className="border-b border-line py-4"><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-semibold">More questions<span aria-hidden className="text-muted">+</span></summary>{aboutFaqs.slice(3).map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} index={index + 3} />)}</details>
        </div>
      </section>

      <section className="container-x py-8 sm:py-16 lg:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-10 lg:p-14">
            <div className="relative max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Start a conversation</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Have a Project in Mind?</h2>
              <p className="mt-4 leading-relaxed text-muted">Need a website, landing page, React application or improvements to an existing site? Let's talk about what you need.</p>
              <div className="mt-6"><Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link></div>
            </div>
          </div>
        </Reveal>
      </section>

    </>
  )
}
