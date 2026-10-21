import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import SelectDropdown from '../ui/SelectDropdown.jsx'
import { budgetOptions, serviceOptions, timelineOptions } from '../../data/contact.js'
import { site } from '../../data/site.js'

const initialValues = {
  name: '', email: '', phone: '', company: '', service: '', description: '',
  website: '', budget: '', timeline: '',
}

const labels = {
  name: 'Name', email: 'Email', service: 'What do you need?', description: 'Project description', website: 'Current website', budget: 'Budget range', timeline: 'Desired timeline',
}

function validate(name, value) {
  const clean = value.trim()
  if (['name', 'email', 'service', 'description', 'budget', 'timeline'].includes(name) && !clean) return `${labels[name]} is required.`
  if (name === 'email' && clean && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return 'Enter a valid email address, such as you@example.com.'
  if (name === 'website' && clean) {
    try {
      const url = new URL(clean)
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error('Invalid URL')
    } catch {
      return 'Enter a full website address, such as https://yourwebsite.com.'
    }
  }
  return ''
}

const controlClass = 'min-h-12 w-full rounded-lg border border-line bg-base px-4 py-3 text-base text-ink placeholder:text-muted/80 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

function createDescriptionPreview(description, maxLength = 280) {
  const clean = String(description ?? '').trim()
  if (clean.length <= maxLength) return clean
  const preview = clean.slice(0, maxLength).replace(/\s+\S*$/, '').trimEnd()
  return `${preview}…`
}

function Field({ id, label, required = false, error, help, children }) {
  const errorId = `${id}-error`
  const helpId = `${id}-help`
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}{required ? <span className="ml-1 text-accent-soft" aria-hidden="true">*</span> : <span className="ml-2 text-xs font-normal text-muted">Optional</span>}
      </label>
      {children({ errorId, helpId })}
      {error && <p id={errorId} className="mt-2 text-sm text-rose-300" role="alert">{error}</p>}
      {help && !error && <p id={helpId} className="mt-2 text-xs leading-relaxed text-muted">{help}</p>}
    </div>
  )
}

export default function ProjectInquiryForm({ initialService = '' }) {
  const successRef = useRef(null)
  const [values, setValues] = useState({ ...initialValues, service: serviceOptions.includes(initialService) ? initialService : '' })
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submission, setSubmission] = useState('idle')
  const [dashboardSyncFailed, setDashboardSyncFailed] = useState(false)

  useEffect(() => {
    if (submission !== 'success') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    successRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [submission])

  const emailJs = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim(),
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim(),
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim(),
  }
  const isConfigured = Object.values(emailJs).every(Boolean)

  const handleChange = ({ target: { name, value } }) => {
    setValues((current) => ({ ...current, [name]: value }))
    if (touched[name]) setErrors((current) => ({ ...current, [name]: validate(name, value) }))
  }

  const handleBlur = ({ target: { name, value } }) => {
    setTouched((current) => ({ ...current, [name]: true }))
    setErrors((current) => ({ ...current, [name]: validate(name, value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submission === 'sending') return
    const nextErrors = Object.fromEntries(Object.keys(initialValues).map((name) => [name, validate(name, values[name])]))
    setErrors(nextErrors)
    setTouched(Object.fromEntries(Object.keys(initialValues).map((name) => [name, true])))
    const firstInvalid = Object.keys(nextErrors).find((name) => nextErrors[name])
    if (firstInvalid) {
      const invalidField = document.getElementById(firstInvalid)
      const collapsedSection = invalidField?.closest('details')
      if (collapsedSection && !collapsedSection.open) {
        collapsedSection.open = true
        window.requestAnimationFrame(() => invalidField.focus())
      } else {
        invalidField?.focus()
      }
      return
    }

    // Quietly discard bot submissions that fill the off-screen honeypot.
    if (honeypot.trim()) {
      setSubmission('success')
      return
    }

    if (!isConfigured) {
      setSubmission('unconfigured')
      return
    }

    setSubmission('sending')
    try {
      const submittedAt = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date())
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJs.serviceId,
          template_id: emailJs.templateId,
          user_id: emailJs.publicKey,
          template_params: {
            name: values.name.trim(),
            email: values.email.trim(),
            reply_to: values.email.trim(),
            phone: values.phone.trim() || 'Not provided',
            has_phone: Boolean(values.phone.trim()),
            has_no_phone: !values.phone.trim(),
            company: values.company.trim() || 'Not provided',
            has_company: true,
            service: values.service.trim(),
            description: createDescriptionPreview(values.description),
            website: values.website.trim() || 'Not provided',
            has_website: Boolean(values.website.trim()),
            has_no_website: !values.website.trim(),
            budget: values.budget.trim(),
            timeline: values.timeline.trim(),
            portfolio_url: window.location.origin,
            linkedin: site.linkedin,
            github: site.github,
            submitted_at: submittedAt,
          },
        }),
      })
      if (!response.ok) throw new Error('EmailJS rejected the inquiry')

      try {
        const dashboardResponse = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            company: values.company,
            website: values.website,
            service: values.service,
            budget: values.budget,
            timeline: values.timeline,
            description: values.description,
          }),
        })
        if (!dashboardResponse.ok) throw new Error('Could not save the dashboard record.')
        const dashboardResult = await dashboardResponse.json()
        if (!dashboardResult.saved) throw new Error('Dashboard did not confirm the save.')
      } catch {
        setDashboardSyncFailed(true)
      }
      setSubmission('success')
    } catch {
      setSubmission('error')
    }
  }

  if (submission === 'success') {
    return (
      <section ref={successRef} role="status" aria-live="polite" className="scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><CircleCheck aria-hidden="true" className="h-6 w-6" /></span>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Inquiry submitted</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Thank you for reaching out.</h2>
        {dashboardSyncFailed && <p className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm leading-relaxed text-amber-100">Your email was sent, but this inquiry could not be saved to the private project dashboard.</p>}
        <p className="mt-3 max-w-lg leading-relaxed text-muted">Your project details have been submitted. I’ll review them and get back to you about the next steps.</p>
        <div className="mt-6 flex flex-col gap-3 min-[380px]:flex-row">
          <Link to="/" className="btn btn-primary">Back to Home<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          <Link to="/work" className="btn btn-ghost">Continue Browsing</Link>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submission === 'sending'} className="rounded-2xl border border-line bg-surface p-4 sm:p-7 lg:p-8">
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="company-website-check">Leave this field blank</label>
        <input id="company-website-check" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>
      <div className="mb-5 sm:mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Project inquiry</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Tell Me About Your Project</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">Share the project details. The email includes a concise brief, and the private dashboard stores the complete inquiry.</p>
      </div>

      <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-5">
        <Field id="name" label="Name" required error={touched.name ? errors.name : ''}>{({ errorId }) => <input id="name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" value={values.name} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.name && errors.name)} aria-describedby={touched.name && errors.name ? errorId : undefined} className={controlClass} />}</Field>
        <Field id="email" label="Email" required error={touched.email ? errors.email : ''}>{({ errorId }) => <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder="you@example.com" value={values.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? errorId : undefined} className={controlClass} />}</Field>
        <Field id="service" label="What do you need?" required error={touched.service ? errors.service : ''}>{({ errorId }) => <SelectDropdown id="service" name="service" value={values.service} placeholder="Select a service" listLabel="Choose a service" options={serviceOptions} required errorId={errorId} error={touched.service ? errors.service : ''} onChange={handleChange} onBlur={handleBlur} />}</Field>
        <Field id="budget" label="Budget range" required error={touched.budget ? errors.budget : ''}>{({ errorId }) => <SelectDropdown id="budget" name="budget" value={values.budget} placeholder="Choose a range" listLabel="Choose a budget range" options={budgetOptions} required errorId={errorId} error={touched.budget ? errors.budget : ''} onChange={handleChange} onBlur={handleBlur} />}</Field>
        <Field id="timeline" label="Desired timeline" required error={touched.timeline ? errors.timeline : ''}>{({ errorId }) => <SelectDropdown id="timeline" name="timeline" value={values.timeline} placeholder="Choose a timeline" listLabel="Choose a timeline" options={timelineOptions} required errorId={errorId} error={touched.timeline ? errors.timeline : ''} onChange={handleChange} onBlur={handleBlur} />}</Field>
        <Field id="phone" label="Contact number">{() => <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="Your phone number (optional)" value={values.phone} onChange={handleChange} onBlur={handleBlur} className={controlClass} />}</Field>
        <div className="md:col-span-2">
          <Field id="description" label="Project description" required error={touched.description ? errors.description : ''} help="Include as much detail as you need (up to 10,000 characters).">{({ errorId, helpId }) => <textarea id="description" name="description" required maxLength={10000} rows={6} placeholder="What are you trying to build or improve? Add requirements, features, references or expectations." value={values.description} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.description && errors.description)} aria-describedby={touched.description && errors.description ? errorId : helpId} className={`${controlClass} min-h-40 resize-y`} />}</Field>
        </div>
      </div>

      <details className="mt-5 rounded-xl border border-line bg-base/40 px-4">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-semibold marker:hidden focus-visible:rounded">
          <span>More about you <span className="ml-1 font-normal text-muted">(optional)</span></span>
          <span aria-hidden className="text-lg text-muted">+</span>
        </summary>
        <div className="grid gap-x-4 gap-y-4 pb-4 md:grid-cols-2 md:gap-y-5">
          <Field id="company" label="Company / business">{() => <input id="company" name="company" type="text" autoComplete="organization" maxLength={120} placeholder="Business or company name" value={values.company} onChange={handleChange} onBlur={handleBlur} className={controlClass} />}</Field>
          <Field id="website" label="Current website" error={touched.website ? errors.website : ''}>{({ errorId }) => <input id="website" name="website" type="url" inputMode="url" autoComplete="url" maxLength={2048} placeholder="https://yourwebsite.com" value={values.website} onChange={handleChange} onBlur={handleBlur} aria-invalid={Boolean(touched.website && errors.website)} aria-describedby={touched.website && errors.website ? errorId : undefined} className={controlClass} />}</Field>
        </div>
      </details>

      <button type="submit" disabled={submission === 'sending'} className="btn btn-primary mt-5 min-h-12 w-full disabled:cursor-wait disabled:opacity-70 sm:mt-7 sm:w-auto">
        {submission === 'sending' ? 'Sending…' : 'Send Project Inquiry'}<ArrowRight aria-hidden className="h-4 w-4" />
      </button>
      {submission === 'success' && <p className="mt-4 text-sm text-emerald-300" role="status">Thanks — your project inquiry has been sent. I’ll be in touch soon.</p>}
      {submission === 'error' && <p className="mt-4 text-sm text-rose-300" role="alert">Something went wrong. Please try again, or <a className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2" href={`mailto:${site.email}`}>contact me directly by email</a>.</p>}
      {submission === 'unconfigured' && <p className="mt-4 text-sm leading-relaxed text-amber-200" role="alert">Online form delivery is not configured yet, so your details were not sent. <a className="inline-flex min-h-11 items-center font-semibold underline underline-offset-2" href={`mailto:${site.email}`}>Email me directly</a>.</p>}
      {submission === 'sending' && <p className="mt-4 text-sm text-muted" role="status">Sending your inquiry…</p>}
      {submission === 'idle' && (isConfigured
        ? <p className="mt-4 text-xs leading-relaxed text-muted">Your inquiry will be sent through EmailJS. If you prefer, <a className="inline-flex min-h-11 items-center font-semibold text-accent-soft underline underline-offset-2" href={`mailto:${site.email}`}>email me directly</a>.</p>
        : <p className="mt-4 text-xs leading-relaxed text-muted">Online form delivery is not configured yet. Your details will not be sent here; <a className="inline-flex min-h-11 items-center font-semibold text-accent-soft underline underline-offset-2" href={`mailto:${site.email}`}>email me directly</a> to get in touch.</p>)}
    </form>
  )
}
