import { Outlet, useLocation } from 'react-router-dom'
import { Suspense, useLayoutEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import RouteErrorBoundary from './RouteErrorBoundary.jsx'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const reduce = useReducedMotion()
  const previousPathname = useRef(pathname)
  useLayoutEffect(() => {
    const routeChanged = previousPathname.current !== pathname
    previousPathname.current = pathname
    if (routeChanged) document.getElementById('main')?.focus({ preventScroll: true })

    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1))
      let attempts = 0
      const scrollToTarget = () => {
        const target = document.getElementById(targetId)
        if (!target) return false
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return true
      }

      if (!scrollToTarget()) {
        const interval = window.setInterval(() => {
          attempts += 1
          if (scrollToTarget() || attempts >= 30) window.clearInterval(interval)
        }, 40)
        return () => window.clearInterval(interval)
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent-button focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Navbar />
      <main id="main" tabIndex="-1">
        <Suspense fallback={<div className="container-x min-h-[50vh] py-16 text-muted" role="status">Loading page…</div>}>
          <RouteErrorBoundary key={pathname}>
            <motion.div
              initial={reduce ? false : { opacity: 1, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
            >
              <Outlet />
            </motion.div>
          </RouteErrorBoundary>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
