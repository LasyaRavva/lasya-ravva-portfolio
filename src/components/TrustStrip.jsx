const items = ['Responsive layouts', 'Clear user journeys', 'React interfaces', 'API integrations', 'Frontend and backend']

export default function TrustStrip() {
  return (
    <section aria-label="Development capabilities" className="border-y border-line bg-surface/40">
      <ul className="container-x flex flex-wrap justify-center gap-x-4 gap-y-2 py-3 text-xs font-semibold text-muted sm:gap-x-8 sm:gap-y-3 sm:py-5 sm:text-sm">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </section>
  )
}
