import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { esc, sendMail } from './_lib/mail.js'

// Contact form ("צור קשר", Hebrew + English): saves to the admin inbox (פניות) and emails the staff at once.
// Recipient: CONTACT_NOTIFY_TO (Vercel env, comma-separated). If the email fails, the message is still saved.
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })
const SITE = process.env.SITE_URL || 'https://lives-of-others.com'
const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const b = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) ?? {}
  if (str(b.website, 200)) return res.status(200).json({ ok: true }) // honeypot: bots fill every field
  const row = { name: str(b.name, 80), phone: str(b.phone, 20) || null, topic: str(b.topic, 80) || null, message: str(b.message, 2000) || null }
  if (!row.name) return res.status(400).json({ error: 'name required' })

  const { error } = await db.from('contact_messages').insert(row)
  if (error) return res.status(500).json({ error: error.message })

  const to = (process.env.CONTACT_NOTIFY_TO || '').split(',').map(s => s.trim()).filter(Boolean)
  let mailed = 0
  const digits = (row.phone ?? '').replace(/\D/g, '')
  const intl = digits.startsWith('0') ? '972' + digits.slice(1) : digits
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#14293A">
    <h2 style="margin:0 0 12px">פנייה חדשה מהאתר 🐾</h2>
    <p><b>שם:</b> ${esc(row.name)}<br>
    <b>טלפון:</b> ${row.phone ? `<a href="tel:${esc(row.phone)}">${esc(row.phone)}</a>` : 'לא נמסר'}<br>
    <b>נושא:</b> ${esc(row.topic)}</p>
    ${row.message ? `<p style="white-space:pre-wrap;background:#F4F9FB;padding:12px;border-radius:8px">${esc(row.message)}</p>` : ''}
    <p>${intl ? `<a href="https://wa.me/${intl}" style="background:#178540;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">💬 לענות בוואטסאפ</a> &nbsp; ` : ''}
    <a href="${SITE}/admin/inbox">לפניות באדמין</a></p>
    <p style="color:#5B7381;font-size:13px">אחרי שעניתם, סמנו "✓ טופל" באדמין.</p></div>`
  for (const addr of to) {
    try { await sendMail({ to: addr, subject: `פנייה חדשה מהאתר: ${row.name} · ${row.topic ?? ''}`, html }); mailed++ }
    catch (e) { console.error('contact mail failed', (e as Error).message) }
  }
  return res.status(200).json({ ok: true, mailed })
}
