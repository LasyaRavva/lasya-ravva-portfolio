import { Link } from 'react-router-dom'
import { ArrowRight, Home as HomeIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import usePageMeta from '../utils/usePageMeta.js'

export default function NotFound() {
  const reduce = useReducedMotion()
  usePageMeta('Page Not Found | Lasya Ravva', 'The page could not be found. Return to Lasya Ravva’s freelance web development portfolio or browse selected work.')

  return (
    <section className="container-x flex min-h-[65vh] items-center py-16 sm:py-24" aria-labelledby="not-found-title">
      <motion.div
        initial={reduce ? false : { opacity: 1, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-2xl"
      >
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">404</p>
        <h1 id="not-found-title" className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found.</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">The page you’re looking for doesn’t exist or may have moved.</p>
        <div className="mt-7 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:flex-wrap">
          <Link to="/" className="btn btn-primary"><HomeIcon aria-hidden className="h-4 w-4" />Back Home</Link>
          <Link to="/work" className="btn btn-ghost">View My Work<ArrowRight aria-hidden className="h-4 w-4" /></Link>
          <Link to="/contact" className="btn btn-ghost">Contact Me</Link>
        </div>
      </motion.div>
    </section>
  )
}
