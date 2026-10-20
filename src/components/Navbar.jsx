import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { site, navLinks } from '../data/site.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return undefined
    const frame = window.requestAnimationFrame(() => menuRef.current?.querySelector('a')?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = ({ isActive }) =>
    `inline-flex min-h-11 items-center border-b-2 text-sm font-semibold transition-colors ${isActive ? 'border-accent-soft text-ink' : 'border-transparent text-muted hover:text-ink'}`

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${scrolled || open ? 'border-line bg-base/90 backdrop-blur' : 'border-transparent bg-transparent'}`}>
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" aria-label={`${site.fullName}, home`} className="inline-flex min-h-11 items-center font-display text-xl font-bold tracking-tight">{site.name}</Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <li key={l.to}><NavLink to={l.to} end={l.to === '/'} className={linkClass}>{l.label}</NavLink></li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link to="/contact" className="btn btn-primary hidden md:inline-flex">Start a Project</Link>
          <button
            type="button"
            className="relative h-11 w-11 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={open ? 'mobile-menu' : undefined}
            ref={menuButtonRef}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`absolute left-2.5 top-[15px] h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`absolute left-2.5 top-[25px] h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className="border-t border-line bg-base md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `flex min-h-11 items-center rounded-md px-3 py-2 text-lg ${isActive ? 'bg-surface text-ink' : 'text-muted'}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2"><Link to="/contact" className="btn btn-primary w-full">Start a Project</Link></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
