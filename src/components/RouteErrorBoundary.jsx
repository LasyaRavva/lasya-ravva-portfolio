import { Component } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, House } from 'lucide-react'

export default class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section role="alert" className="container-x flex min-h-[50vh] items-center py-16" aria-labelledby="route-error-title">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent-soft">Something went wrong</p>
          <h1 id="route-error-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">This page didn’t load as expected.</h1>
          <p className="mt-4 leading-relaxed text-muted">You can return to the portfolio or contact me for help.</p>
          <div className="mt-6 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:flex-wrap">
            <Link to="/" className="btn btn-primary"><House aria-hidden="true" className="h-4 w-4" />Back Home</Link>
            <Link to="/contact" className="btn btn-ghost">Contact Me<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    )
  }
}
