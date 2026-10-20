import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Mail, MessageCircle, Plus } from 'lucide-react'
import ProjectInquiryForm from '../components/contact/ProjectInquiryForm.jsx'
import { contactFaqs, contactSteps } from '../data/contact.js'
import { site } from '../data/site.js'
import usePageMeta from '../utils/usePageMeta.js'

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

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = `contact-faq-answer-${index}`
  return (
    <div className="border-b border-line py-5">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between gap-4 text-left font-semibold focus-visible:rounded">
          <span>{question}</span><Plus aria-hidden className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-45 text-ink' : ''}`} />
        </button>
      </h3>
      <motion.div id={panelId} aria-hidden={!open} initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="overflow-hidden">
        <p className="max-w-2xl pr-10 pt-3 text-sm leading-relaxed text-muted">{answer}</p>
      </motion.div>
    </div>
  )
}

function normalizeService(value) {
  const key = value.trim().toLowerCase()
  if (key.includes('business website')) return 'Business Website'
  if (key.includes('landing page')) return 'Landing Page'
  if (key.includes('react web application')) return 'React Web Application'
  if (key.includes('figma')) return 'Figma → React'
  if (key.includes('website improvement')) return 'Website Improvements'
  return ''
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialService = normalizeService(searchParams.get('service') || '')

  usePageMeta('Start a Project | Lasya — Freelance Web Developer', 'Start a web development project with Lasya. Tell me about your website, web application, landing page or existing website improvements.')

  const methods = [
    { label: 'Email', description: 'Best for project inquiries', href: `mailto:${site.email}`, value: site.email, Icon: Mail },
    { label: 'LinkedIn', description: 'Connect professionally', href: site.linkedin, value: 'Lasya Ravva on LinkedIn', Icon: Linkedin, external: true },
    ...(site.whatsapp ? [{ label: 'WhatsApp', description: 'Quick project discussion', href: site.whatsapp, value: 'Message me on WhatsApp', Icon: MessageCircle, external: true }] : []),
    { label: 'GitHub', description: 'View my development work', href: site.github, value: 'LasyaRavva on GitHub', Icon: Github, external: true },
  ]

  return (
    <>
      <section className="relative isolate overflow-hidden" aria-labelledby="contact-title">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-[68%] -z-10 h-[480px] w-[700px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="container-x py-10 sm:py-16 lg:py-20">
          <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:grid-rows-[auto_1fr] lg:gap-12">
            <div className="order-1 lg:col-start-1 lg:row-start-1">
              <Reveal>
                <p className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-muted">Start a Project</p>
                <h1 id="contact-title" className="mt-5 font-display text-3xl font-extrabold leading-[1.08] tracking-tight min-[380px]:text-4xl sm:mt-6 sm:text-5xl">Let's Build Something Useful.</h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:mt-5 sm:text-lg">Have a website to build, improve, or bring to life? Tell me a little about your project and I'll get back to you with the next steps.</p>
              </Reveal>
            </div>

            <Reveal className="order-2 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1" delay={0.08}>
              <div id="project-inquiry" className="scroll-mt-24"><ProjectInquiryForm initialService={initialService} /></div>
            </Reveal>

            <div className="order-3 lg:col-start-1 lg:row-start-2">
              <div className="mt-1 sm:mt-3 lg:mt-0">
                <h2 className="font-display text-lg font-bold">Reach me directly</h2>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {methods.map(({ label, description, href, value, Icon, external }, index) => (
                    <Reveal as="li" key={label} className="flex items-center gap-3 py-2 sm:items-start sm:py-3" delay={index * 0.035}>
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent-soft"><Icon aria-hidden className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{label}</p>
                        <p className="mt-0.5 hidden text-xs text-muted sm:block">{description}</p>
                        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="inline-flex min-h-11 items-center break-all text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent-soft sm:mt-1">{value}</a>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
              {site.availableForProjects && <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted"><span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />Available for freelance projects</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface/35">
        <div className="container-x py-10 sm:py-16">
          <Reveal><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">After you reach out</p><h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">What Happens Next</h2></div></Reveal>
          <ol className="mt-6 grid gap-x-6 gap-y-4 sm:mt-8 sm:grid-cols-3 sm:gap-y-6">
            {contactSteps.map(([number, title, description], index) => <Reveal as="li" key={number} delay={index * 0.04} className="border-t border-line pt-3 sm:pt-4"><span className="font-display text-sm font-bold text-accent-soft">{number}</span><h3 className="mt-2 font-display text-lg font-bold sm:mt-3">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted sm:mt-2">{description}</p></Reveal>)}
          </ol>
        </div>
      </section>

      <section className="container-x py-8 sm:py-16" aria-labelledby="contact-faq-title">
        <Reveal><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">FAQ</p><h2 id="contact-faq-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Before You Get in Touch</h2></div></Reveal>
        <div className="mt-6 max-w-3xl border-t border-line">
          {contactFaqs.slice(0, 3).map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} index={index} />)}
          <details className="border-b border-line py-4"><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 font-semibold">More questions<span aria-hidden className="text-muted">+</span></summary>{contactFaqs.slice(3).map(([question, answer], index) => <FAQItem key={question} question={question} answer={answer} index={index + 3} />)}</details>
        </div>
      </section>

    </>
  )
}
