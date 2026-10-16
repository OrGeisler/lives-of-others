import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { certificateEmail } from './notify.js'

// Daily 09:00 (Israel) Vercel cron: email the gift recipients whose chosen day has come (if they left an email).
// The WhatsApp to the recipient stays a staff click (admin → מתנות → לשליחה היום). Test payments are skipped.

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).end()
  const { data: gifts } = await db.from('gifts').select('id, payments(source_link)')
    .in('status', ['paid', 'sent']).not('recipient_email', 'is', null).is('recipient_certificate_sent_at', null)
    .lte('send_at', new Date().toISOString())
  const out: Record<string, string> = {}
  for (const g of (gifts ?? []) as unknown as { id: string; payments: { source_link: string | null }[] }[]) {
    if (g.payments?.some(p => p.source_link === 'TEST')) { out[g.id] = 'test, skipped'; continue }
    try {
      const r = await certificateEmail(db, g.id, { toRecipient: true, auto: true })
      out[g.id] = r.ok ? (r.skipped ?? 'sent') : `error ${r.error}`
    } catch (e) { out[g.id] = `error ${(e as Error).message}` }
  }
  return res.status(200).json(out)
}
