import { ArrowRight, ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site, navLinks } from '../data/site.js'

const footerServices = [
  { label: 'Business websites', href: '/services#service-01' },
  { label: 'Landing pages', href: '/services#service-02' },
  { label: 'React web applications', href: '/services#service-03' },
  { label: 'Website improvements', href: '/services#service-04' },
]

const footerLinkClass = 'group relative inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-accent-soft focus-visible:rounded-sm after:absolute after:bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent-soft after:transition-[width] after:duration-200 hover:after:w-full motion-reduce:after:transition-none'

function FooterLink({ href, children, ...props }) {
  const className = `${footerLinkClass} ${props.className || ''}`
  if (href.startsWith('/')) return <Link to={href} className={className}>{children}</Link>
  return <a href={href} className={className} {...props}>{children}</a>
}

export default function Footer() {
  const availabilityLabel = site.availableForProjects ? 'Available for freelance projects' : 'Not currently available'

  return (
    <footer className="border-t border-line bg-surface/35" aria-label="Site footer">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 py-7 sm:gap-x-8 sm:gap-y-10 sm:py-12 min-[760px]:grid-cols-4 lg:grid-cols-4 lg:gap-x-12 lg:py-14">
          <section className="col-span-2 min-[760px]:col-span-2 lg:order-1 lg:col-span-1" aria-labelledby="footer-brand-title">
            <Link to="/" id="footer-brand-title" className="inline-flex min-h-11 items-center font-display text-2xl font-extrabold tracking-tight text-ink transition-colors hover:text-accent-soft focus-visible:rounded-sm">{site.name}</Link>
            <p className="mt-1 text-sm font-semibold text-ink">Freelance Web Developer</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">Responsive websites and web apps for businesses, startups, and growing teams.</p>
            <p className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted">
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${site.availableForProjects ? 'bg-emerald-400' : 'bg-muted'}`} />
              {availabilityLabel}
            </p>
          </section>

          <section className="col-span-2 min-[760px]:col-span-2 lg:order-4 lg:col-span-1" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title" className="min-h-11 content-center font-display text-sm font-bold text-ink">Let's work together</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">Have a project in mind? Let's talk through your goals and the right next step.</p>
            <Link to="/contact" className="group mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent-button px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft motion-reduce:transition-none">
              Start a Project<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <li><FooterLink href={`mailto:${site.email}`} aria-label={`Email Lasya at ${site.email}`}><Mail aria-hidden="true" className="h-4 w-4" />Email</FooterLink></li>
              <li><FooterLink href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)"><Linkedin aria-hidden="true" className="h-4 w-4" />LinkedIn<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></FooterLink></li>
              <li><FooterLink href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub (opens in a new tab)"><Github aria-hidden="true" className="h-4 w-4" />GitHub<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></FooterLink></li>
            </ul>
          </section>

          <section className="min-[760px]:col-span-2 lg:order-2 lg:col-span-1" aria-labelledby="footer-services-title">
            <h2 id="footer-services-title" className="min-h-11 content-center font-display text-sm font-bold text-ink">Services</h2>
            <ul className="mt-1 space-y-0.5">
              {footerServices.map((service) => <li key={service.href}><FooterLink href={service.href}>{service.label}</FooterLink></li>)}
            </ul>
          </section>

          <nav className="min-[760px]:col-span-2 lg:order-3 lg:col-span-1" aria-labelledby="footer-explore-title">
            <h2 id="footer-explore-title" className="min-h-11 content-center font-display text-sm font-bold text-ink">Explore</h2>
            <ul className="mt-1 space-y-0.5">
              {navLinks.slice(0, 4).map((link) => <li key={link.to}><FooterLink href={link.to}>{link.label}</FooterLink></li>)}
              <li><FooterLink href="/about#about-faq-title">FAQ</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </nav>

        </div>

        <div className="flex min-h-14 flex-col justify-center gap-1 border-t border-line py-3 text-xs text-muted sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p>&copy; {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <a href="#main" className="inline-flex min-h-11 w-fit items-center gap-1 text-sm transition-colors hover:text-ink focus-visible:rounded-sm">Back to top <ArrowUp aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  )
}
