import { createHash } from 'node:crypto'

const MAX_DESCRIPTION_LENGTH = 10000
const CHECKLIST_KEYS = ['replied', 'requirements_confirmed', 'proposal_sent', 'work_started', 'delivered']

function reply(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(payload)
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, '')
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  const secretKey = process.env.SUPABASE_SECRET_KEY
  const legacyServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const serviceApiKey = secretKey || legacyServiceRoleKey
  if (!url || !publishableKey || !serviceApiKey) return null
  return { url, publishableKey, serviceApiKey, legacyServiceRoleKey: secretKey ? '' : legacyServiceRoleKey }
}

function privilegedHeaders(config, extra = {}) {
  return {
    apikey: config.serviceApiKey,
    ...(config.legacyServiceRoleKey ? { Authorization: `Bearer ${config.legacyServiceRoleKey}` } : {}),
    ...extra,
  }
}

function asText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

async function isAdmin(req, config) {
  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return false

  const userResponse = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.publishableKey, Authorization: `Bearer ${token}` },
  })
  if (!userResponse.ok) return false
  const user = await userResponse.json()
  if (!user?.id) return false

  const adminResponse = await fetch(
    `${config.url}/rest/v1/portfolio_admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id&limit=1`,
    { headers: privilegedHeaders(config) },
  )
  if (!adminResponse.ok) throw new Error('Unable to verify dashboard access.')
  return (await adminResponse.json()).length > 0
}

async function handleCreate(req, res, config) {
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  const inquiry = {
    name: asText(body.name, 100),
    email: asText(body.email, 254),
    phone: asText(body.phone, 30),
    company: asText(body.company, 120),
    website: asText(body.website, 2048),
    service: asText(body.service, 100),
    budget: asText(body.budget, 100),
    timeline: asText(body.timeline, 100),
    description: asText(body.description, MAX_DESCRIPTION_LENGTH),
    submitted_at: new Date().toISOString(),
  }

  if (!inquiry.name || !inquiry.email || !inquiry.service || !inquiry.budget || !inquiry.timeline || !inquiry.description) {
    return reply(res, 400, { error: 'Some required inquiry details are missing.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return reply(res, 400, { error: 'The email address is invalid.' })
  }
  if (inquiry.website) {
    try {
      const website = new URL(inquiry.website)
      if (!['http:', 'https:'].includes(website.protocol)) throw new Error('Invalid website')
    } catch {
      return reply(res, 400, { error: 'The website address is invalid.' })
    }
  }

  const forwardedFor = req.headers['x-forwarded-for']
  const sourceIp = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  const ipHash = createHash('sha256').update(sourceIp).digest('hex')
  const response = await fetch(`${config.url}/rest/v1/rpc/submit_project_inquiry`, {
    method: 'POST',
    headers: privilegedHeaders(config, {
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    }),
    body: JSON.stringify({
      p_ip_hash: ipHash,
      p_name: inquiry.name,
      p_email: inquiry.email,
      p_phone: inquiry.phone,
      p_company: inquiry.company,
      p_website: inquiry.website,
      p_service: inquiry.service,
      p_budget: inquiry.budget,
      p_timeline: inquiry.timeline,
      p_description: inquiry.description,
    }),
  })
  if (!response.ok) {
    const details = await response.json().catch(() => ({}))
    if (details.code === 'P0001') return reply(res, 429, { error: 'Too many inquiries were submitted from this connection. Please try again later.' })
    return reply(res, 502, { error: 'Unable to save the inquiry to the private dashboard.' })
  }
  return reply(res, 201, { saved: true })
}

async function handleAdminRequest(req, res, config) {
  let admin
  try {
    admin = await isAdmin(req, config)
  } catch {
    return reply(res, 502, { error: 'Could not verify dashboard access.' })
  }
  if (!admin) return reply(res, 401, { error: 'Sign in with an authorized dashboard account.' })

  if (req.method === 'GET') {
    const response = await fetch(
      `${config.url}/rest/v1/project_inquiries?select=id,name,email,phone,company,website,service,budget,timeline,description,submitted_at,created_at,checklist,status&order=created_at.desc&limit=200`,
      { headers: privilegedHeaders(config) },
    )
    if (!response.ok) return reply(res, 502, { error: 'Unable to load inquiries.' })
    return reply(res, 200, await response.json())
  }

  if (req.method === 'PATCH') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    if (typeof body.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.id)) {
      return reply(res, 400, { error: 'A valid inquiry ID is required.' })
    }
    if (!body.checklist || typeof body.checklist !== 'object' || Array.isArray(body.checklist)) {
      return reply(res, 400, { error: 'A valid checklist is required.' })
    }
    const checklist = Object.fromEntries(CHECKLIST_KEYS.map((key) => [key, body.checklist[key] === true]))
    const completedCount = Object.values(checklist).filter(Boolean).length
    const status = completedCount === CHECKLIST_KEYS.length ? 'completed' : completedCount ? 'in_progress' : 'new'
    const response = await fetch(
      `${config.url}/rest/v1/project_inquiries?id=eq.${encodeURIComponent(body.id)}`,
      {
        method: 'PATCH',
        headers: privilegedHeaders(config, {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({ checklist, status }),
      },
    )
    if (!response.ok) return reply(res, 502, { error: 'Unable to update this inquiry.' })
    const updated = await response.json()
    if (!updated.length) return reply(res, 404, { error: 'Inquiry not found.' })
    return reply(res, 200, updated[0])
  }

  return reply(res, 405, { error: 'Method not allowed.' })
}

export default async function handler(req, res) {
  const config = getConfig()
  if (!config) return reply(res, 503, { error: 'The private inquiry dashboard is not configured yet.' })

  try {
    if (req.method === 'POST') return await handleCreate(req, res, config)
    if (req.method === 'GET' || req.method === 'PATCH') return await handleAdminRequest(req, res, config)
    res.setHeader('Allow', 'GET, POST, PATCH')
    return reply(res, 405, { error: 'Method not allowed.' })
  } catch {
    return reply(res, 500, { error: 'The inquiry service encountered an error.' })
  }
}
