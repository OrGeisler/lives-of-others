import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { certificatePdf } from './_lib/pdf.js'
import { SITE, birthdayThanksEmail, certificateEmail } from './_lib/notify.js'

// POST, authorized by header x-internal-secret (grow-webhook, automatic) or a staff JWT (admin 📧 buttons).
//   { id, to?: 'recipient', auto?: true }  → certificate email (virtual → adopter; gift → buyer or recipient)
//   { payment_id, kind: 'birthday', auto?: true } → birthday thank-you email
// auto = skip if already sent. Email texts live in ./_lib/notify.ts.
export const config = { maxDuration: 60 }

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })

async function authorized(req: VercelRequest) {
  if (process.env.INTERNAL_SECRET && req.headers['x-internal-secret'] === process.env.INTERNAL_SECRET) return true
  const jwt = (req.headers.authorization || '').replace(/^Bearer /, '')
  if (!jwt) return false
  const { data } = await db.auth.getUser(jwt)
  if (!data.user) return false
  const { data: staff } = await db.from('staff').select('user_id').eq('user_id', data.user.id).maybeSingle()
  return !!staff
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!(await authorized(req))) return res.status(403).json({ error: 'forbidden' })
  const b = (req.body ?? {}) as { id?: string; to?: string; auto?: boolean; payment_id?: string; kind?: string }
  const uuid = (s: unknown) => /^[0-9a-f-]{36}$/.test(String(s ?? ''))
  try {
    if (b.kind === 'birthday') {
      if (!uuid(b.payment_id)) return res.status(400).json({ error: 'bad payment_id' })
      const r = await birthdayThanksEmail(db, String(b.payment_id), { auto: !!b.auto })
      return r.ok ? res.status(200).json(r) : res.status(r.status).json({ error: r.error })
    }
    if (!uuid(b.id)) return res.status(400).json({ error: 'bad id' })
    // ?dry=1 (internal secret only): return the PDF instead of emailing it — for testing the renderer
    if (req.query.dry && req.headers['x-internal-secret'] === process.env.INTERNAL_SECRET) {
      res.setHeader('Content-Type', 'application/pdf')
      return res.status(200).send(await certificatePdf(SITE, String(b.id)))
    }
    const r = await certificateEmail(db, String(b.id), { toRecipient: b.to === 'recipient', auto: !!b.auto })
    return r.ok ? res.status(200).json(r) : res.status(r.status).json({ error: r.error })
  } catch (e) {
    console.error('send failed', e)
    return res.status(500).json({ error: (e as Error).message })
  }
}
