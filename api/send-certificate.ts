import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { certificatePdf } from './_lib/pdf.js'
import { esc, sendMail } from './_lib/mail.js'

// POST { id } with header x-internal-secret — called by the Grow webhook once a payment is confirmed,
// and by the admin "send again" button (with the staff member's JWT instead of the secret).
// Renders the certificate to PDF and emails it: virtual adoption → the adopter; gift → the gift buyer
// (who chose when/how to hand it over; the recipient gets the WhatsApp surprise from the nonprofit).
export const config = { maxDuration: 60 }

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })
const SITE = process.env.SITE_URL || 'https://lives-of-others.com'

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
  const id = String((req.body ?? {}).id ?? '')
  const toRecipient = (req.body ?? {}).to === 'recipient'
  if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).json({ error: 'bad id' })

  const { data: cert } = await db.rpc('get_certificate', { p_id: id })
  if (!cert) return res.status(404).json({ error: 'certificate not available (not paid yet?)' })
  const gift = cert.type === 'gift'

  // ?dry=1 (internal secret only): return the PDF instead of emailing it — for testing the renderer
  if (req.query.dry && req.headers['x-internal-secret'] === process.env.INTERNAL_SECRET) {
    const pdf = await certificatePdf(SITE, id)
    res.setHeader('Content-Type', 'application/pdf')
    return res.status(200).send(pdf)
  }

  // who gets the email
  if (toRecipient && !gift) return res.status(400).json({ error: 'recipient only for gifts' })
  const q = gift
    ? db.from('gifts').select('recipient_email, recipient_name, donors:buyer_donor_id(email, honor_name)').eq('id', id).single()
    : db.from('sponsorships').select('donors(email, honor_name)').eq('id', id).single()
  const { data: row } = await q
  const r = row as unknown as { recipient_email?: string | null; recipient_name?: string | null; donors: { email: string | null; honor_name: string | null } | null } | null
  const donor = toRecipient ? { email: r?.recipient_email ?? null, honor_name: r?.recipient_name ?? null } : r?.donors
  if (!donor?.email) return res.status(422).json({ error: 'no email for this donor' })
  const fromName = r?.donors?.honor_name ?? ''

  const pdf = await certificatePdf(SITE, id)
  const link = `${SITE}/certificate/${id}`
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#123A5A;line-height:1.7">
    <div style="text-align:center"><img src="${SITE}/assets/img/logo.jpg" width="72" height="72" style="border-radius:50%" alt=""></div>
    <h2 style="text-align:center;margin:12px 0">${gift ? 'תעודת האימוץ במתנה מוכנה 🎁' : 'תודה שהפכת למלאך השומר 😇'}</h2>
    <p>${esc(donor.honor_name)} היקר/ה,</p>
    <p>${toRecipient
      ? `יש לך הפתעה! 🎁 <b>${esc(fromName)}</b> העניק/ה לך מתנה מיוחדת: אימוץ וירטואלי של <b>${esc(cert.dog)}</b> מעמותת חיים של אחרים.${cert.greeting ? `<br><br><i>"${esc(cert.greeting)}"</i>` : ''}<br><br>מצורפת תעודת האימוץ שלך.`
      : gift
      ? `תודה על המתנה המרגשת! מצורפת תעודת האימוץ במתנה של <b>${esc(cert.dog)}</b> עבור <b>${esc(cert.name)}</b> — אפשר להדפיס או לשלוח אותה.`
      : `בזכותך <b>${esc(cert.dog)}</b> זוכה לקורת גג בטוחה, אוכל טוב, טיפול רפואי והמון אהבה. מצורפת תעודת האימוץ האישית שלך.`}</p>
    <p>פעם בחודש יגיע עדכון אישי מ${esc(cert.dog)}, עם תמונות וסרטונים 🐾</p>
    <p style="text-align:center;margin:22px 0"><a href="${link}" style="background:#E0678F;color:#fff;padding:13px 26px;border-radius:999px;text-decoration:none;font-weight:bold">לצפייה בתעודה</a></p>
    <p style="font-size:13px;color:#667">עמותת חיים של אחרים · ע"ר 580754083 · <a href="${SITE}" style="color:#1E6E9C">lives-of-others.com</a></p>
  </div>`

  await sendMail({
    to: donor.email,
    subject: toRecipient ? `🎁 קיבלת מתנה — אימוץ וירטואלי של ${cert.dog}` : gift ? `🎁 תעודת אימוץ במתנה — ${cert.dog}` : `😇 תעודת האימוץ שלך — המלאך השומר של ${cert.dog}`,
    html, replyTo: process.env.MAIL_REPLY_TO || undefined,
    attachments: [{ filename: `תעודת אימוץ - ${cert.dog}.pdf`, content: pdf }],
  })
  await db.from(gift ? 'gifts' : 'sponsorships').update({ [toRecipient ? 'recipient_certificate_sent_at' : 'certificate_sent_at']: new Date().toISOString() }).eq('id', id)
  return res.status(200).json({ ok: true })
}
