import { useEffect, useMemo, useState } from 'react'
import { Check, CircleCheck, ClipboardList, Clock3, LogOut, Search, ShieldCheck } from 'lucide-react'

const checklistItems = [
  ['replied', 'Reply to the client'],
  ['requirements_confirmed', 'Confirm requirements'],
  ['proposal_sent', 'Send proposal or quote'],
  ['work_started', 'Start the project'],
  ['delivered', 'Deliver the completed work'],
]

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '')
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
const isConfigured = Boolean(supabaseUrl && supabasePublishableKey)

async function authRequest(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabasePublishableKey,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.msg || payload.message || payload.error_description || 'Sign-in failed.')
  return payload
}

async function dashboardRequest(token, method = 'GET', body) {
  const response = await fetch('/api/inquiries', {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('The inquiry API did not return JSON. If you are running the site locally with Vite, start it with `npx vercel dev` so the /api/inquiries function is available, or open the deployed site.')
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'The inquiry dashboard could not be reached.')
  if (method === 'GET' && !Array.isArray(payload)) throw new Error('The dashboard API returned an unexpected response.')
  return payload
}

function formatDate(value) {
  if (!value) return 'Date unavailable'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

function fieldValue(value) {
  return typeof value === 'string' && value.trim() ? value : 'Not provided'
}

function SignIn({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await onSignIn(email.trim(), password)
    } catch (signInError) {
      setError(signInError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-base px-4 py-10 text-ink">
      <section className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 sm:p-9" aria-labelledby="admin-sign-in-title">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-soft"><ShieldCheck aria-hidden className="h-6 w-6" /></span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent-soft">Private workspace</p>
        <h1 id="admin-sign-in-title" className="mt-2 font-display text-3xl font-extrabold tracking-tight">Inquiry dashboard</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">Sign in with your authorized account to view client inquiries and update their progress.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">Email</label>
            <input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full cursor-text select-text rounded-lg border border-line bg-base px-4 text-base text-ink caret-accent-soft placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full cursor-text select-text rounded-lg border border-line bg-base px-4 text-base text-ink caret-accent-soft placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
          <button type="submit" disabled={busy} className="btn btn-primary min-h-12 w-full disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-muted">Dashboard accounts are created by the site owner. There is no public sign-up.</p>
      </section>
    </main>
  )
}

function Metric({ label, value, Icon, tone = 'text-accent-soft' }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><p className="text-sm text-muted">{label}</p><Icon aria-hidden className={`h-5 w-5 ${tone}`} /></div>
      <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
    </div>
  )
}

export default function AdminInquiries() {
  const [token, setToken] = useState('')
  const [inquiries, setInquiries] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadInquiries = async (accessToken) => {
    const rows = await dashboardRequest(accessToken)
    setInquiries(rows)
    setSelectedId((current) => (rows.some((row) => row.id === current) ? current : rows[0]?.id || ''))
  }

  useEffect(() => {
    document.title = 'Private Inquiry Dashboard | Lasya'
    const existingRobots = document.querySelector('meta[name="robots"]')
    const robotsMeta = existingRobots || document.createElement('meta')
    if (!existingRobots) {
      robotsMeta.name = 'robots'
      document.head.appendChild(robotsMeta)
    }
    const previousRobotsContent = robotsMeta.content
    robotsMeta.content = 'noindex, nofollow, noarchive'
    if (!isConfigured) {
      setLoading(false)
      return () => {
        if (existingRobots) robotsMeta.content = previousRobotsContent
        else robotsMeta.remove()
      }
    }
    const savedToken = sessionStorage.getItem('portfolio-admin-token')
    if (!savedToken) {
      setLoading(false)
      return () => {
        if (existingRobots) robotsMeta.content = previousRobotsContent
        else robotsMeta.remove()
      }
    }
    authRequest('user', { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(() => loadInquiries(savedToken).then(() => setToken(savedToken)))
      .catch(() => sessionStorage.removeItem('portfolio-admin-token'))
      .finally(() => setLoading(false))
    return () => {
      if (existingRobots) robotsMeta.content = previousRobotsContent
      else robotsMeta.remove()
    }
  }, [])

  const signIn = async (email, password) => {
    const session = await authRequest('token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (!session.access_token) throw new Error('Sign-in did not return an access token.')
    await loadInquiries(session.access_token)
    sessionStorage.setItem('portfolio-admin-token', session.access_token)
    setToken(session.access_token)
  }

  const signOut = () => {
    sessionStorage.removeItem('portfolio-admin-token')
    setToken('')
    setInquiries([])
    setSelectedId('')
    setSearch('')
    setFilter('all')
    setError('')
  }

  const counts = useMemo(() => ({
    total: inquiries.length,
    active: inquiries.filter((item) => item.status !== 'completed').length,
    completed: inquiries.filter((item) => item.status === 'completed').length,
  }), [inquiries])

  const visibleInquiries = useMemo(() => {
    const query = search.trim().toLowerCase()
    return inquiries.filter((item) => {
      const matchesFilter = filter === 'all' || (filter === 'active' ? item.status !== 'completed' : item.status === 'completed')
      const matchesSearch = !query || [item.name, item.email, item.company, item.service].some((value) => value?.toLowerCase().includes(query))
      return matchesFilter && matchesSearch
    })
  }, [filter, inquiries, search])

  const selected = inquiries.find((item) => item.id === selectedId)

  const toggleChecklist = async (key, checked) => {
    if (!selected || !token || saving) return
    const previous = inquiries
    const checklist = { ...(selected.checklist || {}), [key]: checked }
    const count = Object.values(checklist).filter(Boolean).length
    const status = count === checklistItems.length ? 'completed' : count ? 'in_progress' : 'new'
    setInquiries((items) => items.map((item) => item.id === selected.id ? { ...item, checklist, status } : item))
    setSaving(true)
    setError('')
    try {
      const updated = await dashboardRequest(token, 'PATCH', { id: selected.id, checklist })
      setInquiries((items) => items.map((item) => item.id === updated.id ? updated : item))
    } catch (updateError) {
      setInquiries(previous)
      setError(updateError.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isConfigured) {
    return (
      <main className="grid min-h-screen place-items-center bg-base px-4 py-10 text-ink">
        <section className="max-w-xl rounded-2xl border border-line bg-surface p-6 sm:p-9">
          <ShieldCheck aria-hidden className="h-8 w-8 text-accent-soft" />
          <h1 className="mt-5 font-display text-2xl font-extrabold">Dashboard setup required</h1>
          <p className="mt-3 leading-relaxed text-muted">Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to the deployment environment, then deploy again. The server also needs the private Supabase secret key.</p>
        </section>
      </main>
    )
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-base text-muted" role="status">Loading private dashboard…</main>
  if (!token) return <SignIn onSignIn={signIn} />

  return (
    <main className="min-h-screen bg-base px-4 py-8 text-ink sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-soft">Private workspace</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Inquiry dashboard</h1><p className="mt-2 text-sm text-muted">Review requests and track each project from first reply to delivery.</p></div>
          <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold transition hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><LogOut aria-hidden className="h-4 w-4" />Sign out</button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Inquiry totals">
          <Metric label="Total inquiries" value={counts.total} Icon={ClipboardList} />
          <Metric label="Open inquiries" value={counts.active} Icon={Clock3} tone="text-amber-300" />
          <Metric label="Completed" value={counts.completed} Icon={CircleCheck} tone="text-emerald-300" />
        </section>

        {error && <p role="alert" className="mt-5 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}

        <section className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <div className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <label className="relative block"><span className="sr-only">Search inquiries</span><Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, company…" className="min-h-11 w-full rounded-lg border border-line bg-base pl-10 pr-3 text-sm focus:border-accent focus:outline-none" /></label>
              <div className="flex gap-2" aria-label="Filter inquiries">
                {['all', 'active', 'completed'].map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className={`min-h-9 rounded-full px-3 text-xs font-bold capitalize ${filter === item ? 'bg-accent-button text-white' : 'border border-line text-muted hover:text-ink'}`}>{item}</button>)}
              </div>
            </div>
            <div className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {visibleInquiries.map((item) => {
                const done = Object.values(item.checklist || {}).filter(Boolean).length
                return <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selectedId === item.id} className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${selectedId === item.id ? 'border-accent/50 bg-accent/10' : 'border-line bg-base/50 hover:bg-base'}`}>
                  <span className="flex items-start justify-between gap-3"><span className="min-w-0"><span className="block truncate font-bold">{item.name}</span><span className="mt-1 block truncate text-xs text-muted">{item.service}</span></span><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${item.status === 'completed' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-accent/10 text-accent-soft'}`}>{item.status === 'in_progress' ? 'In progress' : item.status}</span></span>
                  <span className="mt-3 flex items-center justify-between text-xs text-muted"><span>{formatDate(item.created_at || item.submitted_at)}</span><span>{done}/{checklistItems.length} complete</span></span>
                </button>
              })}
              {!visibleInquiries.length && <p className="rounded-xl border border-dashed border-line p-5 text-sm leading-relaxed text-muted">{inquiries.length ? 'No inquiries match these filters.' : 'No inquiries yet. New submissions will appear here.'}</p>}
            </div>
          </div>

          {selected ? <article className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-soft">Project inquiry</p><h2 className="mt-2 font-display text-2xl font-extrabold">{selected.name}</h2><p className="mt-1 text-sm text-muted">Received {formatDate(selected.created_at || selected.submitted_at)}</p></div><span className="rounded-full border border-line px-3 py-1.5 text-xs font-bold capitalize text-muted">{selected.status === 'in_progress' ? 'In progress' : selected.status}</span></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Email', selected.email, 'email'], ['Phone', selected.phone, 'phone'], ['Company', selected.company], ['Website', selected.website, 'website'],
                ['Service', selected.service], ['Budget', selected.budget], ['Timeline', selected.timeline],
              ].map(([label, value, kind]) => <div key={label} className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>{kind === 'email' && value ? <a className="mt-1 block break-all font-semibold text-accent-soft underline underline-offset-4" href={`mailto:${value}`}>{value}</a> : kind === 'phone' && value ? <a className="mt-1 block break-all font-semibold text-accent-soft underline underline-offset-4" href={`tel:${value}`}>{value}</a> : kind === 'website' && value ? <a className="mt-1 block break-all font-semibold text-accent-soft underline underline-offset-4" href={value} target="_blank" rel="noreferrer">{value}</a> : <p className="mt-1 break-words font-semibold">{fieldValue(value)}</p>}</div>)}
            </div>
            <section className="mt-6" aria-labelledby="inquiry-description-title"><h3 id="inquiry-description-title" className="text-xs font-bold uppercase tracking-wide text-muted">Project description</h3><p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-line bg-base/60 p-4 text-sm leading-relaxed">{selected.description}</p></section>
            <section className="mt-6" aria-labelledby="inquiry-progress-title"><div className="flex flex-wrap items-end justify-between gap-2"><div><h3 id="inquiry-progress-title" className="font-display text-lg font-bold">Progress checklist</h3><p className="mt-1 text-xs text-muted">Mark each step when it is done.</p></div><span className="text-sm font-bold text-accent-soft">{Object.values(selected.checklist || {}).filter(Boolean).length} of {checklistItems.length} complete</span></div>
              <div className="mt-3 divide-y divide-line rounded-xl border border-line bg-base/40 px-4">{checklistItems.map(([key, label]) => <label key={key} className="flex min-h-12 cursor-pointer items-center gap-3 py-3 text-sm"><input type="checkbox" checked={selected.checklist?.[key] === true} disabled={saving} onChange={(event) => toggleChecklist(key, event.target.checked)} className="h-4 w-4 accent-violet-500" /><span className={selected.checklist?.[key] ? 'text-muted line-through' : 'font-medium'}>{label}</span>{selected.checklist?.[key] && <Check aria-hidden className="ml-auto h-4 w-4 text-emerald-300" />}</label>)}</div>
              {saving && <p className="mt-2 text-xs text-muted" role="status">Saving progress…</p>}
            </section>
          </article> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">Select an inquiry to see its details and checklist.</div>}
        </section>
        <footer className="mt-8 border-t border-line pt-4 text-xs text-muted">Private inquiry records are available only to authorized dashboard accounts.</footer>
      </div>
    </main>
  )
}
