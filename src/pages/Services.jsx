import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { comparisonRows, processSteps, projectFaqs, services } from '../data/services.js'
import usePageMeta from '../utils/usePageMeta.js'

function Reveal({ children, className = '', delay = 0, id, as = 'div' }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    <MotionTag
      initial={reduce ? false : { opacity: 1, y: 6 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
      id={id}
    >
      {children}
    </MotionTag>
  )
}

function SectionHeading({ eyebrow, title, description, id }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted">{description}</p>}
    </div>
  )
}

function ServiceDetail({ service, index }) {
  const reverse = index % 2 === 1
  return (
    <Reveal id={`service-${service.number}`} className="scroll-mt-24">
      <details className="group rounded-2xl border border-line bg-surface/60 px-4 md:hidden">
        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 py-3 marker:hidden focus-visible:rounded">
          <span><span className="block text-xs font-bold uppercase tracking-wider text-accent-soft">Service {service.number}</span><span role="heading" aria-level="3" className="mt-1 block font-display text-lg font-bold">{service.title}</span><span className="mt-1 block text-sm leading-relaxed text-muted">{service.description}</span></span>
          <span aria-hidden className="shrink-0 text-lg text-accent-soft transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-line pb-4 pt-4">
          <h4 className="font-display text-lg font-bold leading-snug">{service.headline}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted">{service.detail}</p>
          <p className="mt-5 text-sm font-bold">Good fit for</p>
          <ul className="mt-2 flex flex-wrap gap-2">{service.ideal.map((item) => <li key={item} className="rounded-full border border-line bg-base/70 px-3 py-1.5 text-xs text-muted">{item}</li>)}</ul>
          <p className="mt-5 text-sm font-bold">What I can deliver</p>
          <ul className="mt-2 space-y-2">{service.includes.map((item) => <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />{item}</li>)}</ul>
          <Link to={`/contact?service=${encodeURIComponent(service.title)}`} className="btn btn-primary mt-5">{service.cta}<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
      </details>
      <article className={`hidden gap-8 rounded-3xl border border-line bg-surface/60 p-6 sm:p-9 md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-6 lg:p-8 xl:gap-14 xl:p-12 ${reverse ? 'md:[&>:first-child]:order-2' : ''}`}>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Service {service.number}</p>
          <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{service.title}</h3>
          <h4 className="mt-5 text-xl font-bold leading-snug sm:text-2xl">{service.headline}</h4>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{service.detail}</p>
          <p className="mt-7 text-sm font-bold text-ink">Ideal for</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {service.ideal.map((item) => <li key={item} className="rounded-full border border-line bg-base/70 px-3 py-1.5 text-sm text-muted">{item}</li>)}
          </ul>
          <Link to={`/contact?service=${encodeURIComponent(service.title)}`} className="btn btn-primary mt-8">{service.cta}<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-2xl border border-line bg-base p-6 sm:p-8">
          <p className="font-display text-lg font-bold">What I can deliver</p>
          <ul className="mt-5 space-y-4">
            {service.includes.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15"><Check aria-hidden className="h-3.5 w-3.5 text-accent-soft" /></span>{item}</li>)}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

export default function Services() {
  usePageMeta('Freelance Web Development Services | Lasya Ravva', 'Explore freelance web development services including business websites, landing pages, React web applications and website improvements.')

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x py-10 sm:py-20 lg:py-24">
          <Reveal>
            <p className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted">Services</p>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Web Solutions Built Around Your Business.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">I design and develop responsive websites and web applications that are clear, modern, and built around what your business actually needs.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link>
              <Link to="/work" className="btn btn-ghost">View My Work</Link>
            </div>
            <a href="#service-details-title" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink sm:mt-12">Explore services<ArrowDown aria-hidden className="h-4 w-4" /></a>
          </Reveal>
        </div>
      </section>

      <section className="container-x space-y-3 py-8 sm:space-y-5 sm:py-16" aria-labelledby="service-details-title">
        <Reveal><SectionHeading eyebrow="A closer look" title="What your project can include." description="Every project is scoped around your goals. These examples help show what we can plan together." /></Reveal>
        <h2 id="service-details-title" className="sr-only">Detailed service information</h2>
        {services.map((service, i) => <ServiceDetail key={service.number} service={service} index={i} />)}
      </section>


      <section className="border-y border-line bg-surface/35">
        <div className="container-x py-10 sm:py-20">
          <Reveal><SectionHeading eyebrow="My process" title="Clear steps, from first conversation to launch." description="We’ll keep the scope and next step visible as the project moves forward." /></Reveal>
          <ol className="mt-7 grid grid-cols-1 gap-2 sm:mt-9 min-[430px]:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {processSteps.map(([number, title, description], i) => <Reveal as="li" key={number} delay={i * 0.04} className={`h-full rounded-xl border border-line bg-base/70 p-3 sm:p-5 ${i === processSteps.length - 1 ? 'min-[430px]:col-span-2 lg:col-span-1' : ''}`}><span className="font-display text-sm font-bold text-accent-soft">{number}</span><h3 className="mt-2 font-display text-base font-bold sm:mt-4 sm:text-lg">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted sm:mt-2">{description}</p></Reveal>)}
          </ol>
        </div>
      </section>

      <section className="container-x py-10 sm:py-20">
        <Reveal><SectionHeading eyebrow="Compare options" title="A quick way to find your starting point." description="Scope, integrations and complexity are confirmed together before I prepare a custom quote." /></Reveal>
        <div className="mt-8 grid grid-cols-1 gap-3 xl:hidden">
          {services.map((service, serviceIndex) => (
            <details key={service.number} className="group rounded-2xl border border-line bg-surface/70 px-4 transition-colors open:border-accent/40 sm:px-5">
              <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-ink marker:hidden focus-visible:rounded [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold leading-snug text-ink sm:text-lg">{service.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted"><span className="font-semibold text-ink">Best for:</span> {comparisonRows[0][serviceIndex + 1]}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted"><span className="font-semibold text-ink">Scope:</span> {comparisonRows[1][serviceIndex + 1]}</span>
                </span>
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-lg text-accent-soft transition-transform group-open:rotate-45 group-open:border-accent/40">+</span>
              </summary>
              <dl className="grid gap-0 border-t border-line pb-2 pt-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">
                {comparisonRows.slice(2).map(([label, ...values]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 border-b border-line/70 py-3 text-sm last:border-0 sm:last:border-b lg:border-b">
                    <dt className="font-semibold text-muted">{label}</dt><dd className="text-right font-medium">{values[serviceIndex]}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <div className="mt-8 hidden overflow-hidden rounded-2xl border border-line xl:block">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <thead className="bg-surface"><tr><th scope="col" className="w-[20%] p-3 font-bold xl:p-4">Project type</th>{services.map((s) => <th scope="col" key={s.number} className="break-words p-3 font-display font-bold xl:p-4">{s.title}</th>)}</tr></thead>
            <tbody>{comparisonRows.map(([label, ...values]) => <tr key={label} className="border-t border-line"><th scope="row" className="p-3 font-semibold text-muted xl:p-4">{label}</th>{values.map((v, i) => <td key={`${label}-${i}`} className="break-words p-3 text-muted xl:p-4">{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="container-x py-8 sm:py-16" aria-labelledby="faq-title">
        <Reveal><SectionHeading id="faq-title" eyebrow="FAQ" title="A few helpful answers." description="If you have a question that isn’t covered here, send it along with your project details." /></Reveal>
        <div className="mt-6 max-w-3xl divide-y divide-line border-y border-line sm:mt-8">
          {projectFaqs.slice(0, 5).map(([question, answer], i) => <Reveal key={question} delay={i * 0.015}><details className="group py-4 sm:py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden focus-visible:rounded"><span>{question}</span><span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:text-ink">+</span></summary><p className="max-w-2xl pr-10 pt-3 text-sm leading-relaxed text-muted">{answer}</p></details></Reveal>)}
        </div>
      </section>

      <section className="container-x py-10 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-7 sm:p-10 lg:p-14">
            <div className="relative max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Let’s talk</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Not Sure Which Service You Need?</h2>
              <p className="mt-4 leading-relaxed text-muted">Tell me what you're trying to build or improve. I'll help you figure out the right approach.</p>
              <div className="mt-6"><Link to="/contact" className="btn btn-primary">Start a Project<ArrowRight aria-hidden className="h-4 w-4" /></Link></div>
            </div>
          </div>
        </Reveal>
      </section>

    </>
  )
}
