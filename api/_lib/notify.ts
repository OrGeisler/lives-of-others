import type { SupabaseClient } from '@supabase/supabase-js'
import { certificatePdf } from './pdf.js'
import { esc, sendMail } from './mail.js'

// Every email the site sends. Called automatically (grow-webhook on payment, the daily gift cron) and by the
// admin's 📧 buttons. `auto` = skip if this email was already sent (no duplicates); the admin button resends.
// Each email also tells people a WhatsApp is coming: the staff send it by hand from the admin (WaShare).
export const SITE = process.env.SITE_URL || 'https://lives-of-others.com'
export type Result = { ok: true; skipped?: string } | { ok: false; status: number; error: string }

const shell = (title: string, body: string, cta?: { href: string; label: string }) => `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#123A5A;line-height:1.7">
  <div style="text-align:center"><img src="${SITE}/assets/img/logo.jpg" width="72" height="72" style="border-radius:50%" alt=""></div>
  <h2 style="text-align:center;margin:12px 0">${title}</h2>
  ${body}
  ${cta ? `<p style="text-align:center;margin:22px 0"><a href="${cta.href}" style="background:#E0678F;color:#fff;padding:13px 26px;border-radius:999px;text-decoration:none;font-weight:bold">${cta.label}</a></p>` : ''}
  <p style="font-size:13px;color:#667">עמותת חיים של אחרים · ע"ר 580754083 · <a href="${SITE}" style="color:#1E6E9C">lives-of-others.com</a></p>
</div>`
const waNote = (text: string) =>
  `<p style="background:#E9F9EF;border-radius:12px;padding:10px 14px;color:#1d6b3a">📱 ${text}</p>`

// Certificate email. virtual → the adopter; gift → the buyer, or (to='recipient') the person receiving the gift.
export async function certificateEmail(db: SupabaseClient, id: string, opts: { toRecipient?: boolean; auto?: boolean } = {}): Promise<Result> {
  const { toRecipient = false, auto = false } = opts
  const { data: cert } = await db.rpc('get_certificate', { p_id: id })
  if (!cert) return { ok: false, status: 404, error: 'certificate not available (not paid yet?)' }
  const gift = cert.type === 'gift'
  if (toRecipient && !gift) return { ok: false, status: 400, error: 'recipient only for gifts' }
  const sentField = toRecipient ? 'recipient_certificate_sent_at' : 'certificate_sent_at'
  const q = gift
    ? db.from('gifts').select(`recipient_email, recipient_name, ${sentField}, donors:buyer_donor_id(email, honor_name)`).eq('id', id).single()
    : db.from('sponsorships').select(`${sentField}, donors(email, honor_name)`).eq('id', id).single()
  const { data: row } = await q
  const r = row as unknown as Record<string, unknown> & { recipient_email?: string | null; recipient_name?: string | null; donors: { email: string | null; honor_name: string | null } | null } | null
  if (auto && r?.[sentField]) return { ok: true, skipped: 'already sent' }
  const person = toRecipient ? { email: r?.recipient_email ?? null, honor_name: r?.recipient_name ?? null } : r?.donors
  if (!person?.email) return auto ? { ok: true, skipped: 'no email' } : { ok: false, status: 422, error: 'no email for this donor' }

  const dog = esc(cert.dog), from = esc(r?.donors?.honor_name ?? '')
  const text = toRecipient
    ? `יש לך הפתעה! 🎁 <b>${from}</b> העניק/ה לך מתנה מיוחדת: אימוץ וירטואלי של <b>${dog}</b> מעמותת חיים של אחרים.${cert.greeting ? `<br><br><i>"${esc(cert.greeting)}"</i>` : ''}<br><br>מצורפת תעודת האימוץ שלך. פעם בחודש יגיע אליך עדכון אישי מ${dog}, עם תמונות וסרטונים 🐾`
    : gift
    ? `תודה על המתנה המרגשת! 💛 מצורפת תעודת האימוץ במתנה של <b>${dog}</b> עבור <b>${esc(cert.name)}</b>.`
    : `בזכותך <b>${dog}</b> זוכה לקורת גג בטוחה, אוכל טוב, טיפול רפואי והמון אהבה. מצורפת תעודת האימוץ האישית שלך. פעם בחודש יגיע אליך עדכון אישי מ${dog}, עם תמונות וסרטונים 🐾`
  const wa = toRecipient
    ? waNote(`בימים הקרובים תקבל/י מ${dog} גם הודעה אישית בוואטסאפ 🐾`)
    : gift
    ? waNote(`ביום שבחרת נשלח ל${esc(cert.name)} את ההפתעה בהודעת וואטסאפ אישית מ${dog}, יחד עם התעודה והברכה שלך.`)
    : waNote(`בימים הקרובים תקבל/י מאיתנו גם הודעה אישית בוואטסאפ מ${dog} 🐾`)
  const pdf = await certificatePdf(SITE, id)
  await sendMail({
    to: person.email,
    subject: toRecipient ? `🎁 קיבלת מתנה — אימוץ וירטואלי של ${cert.dog}` : gift ? `🎁 תעודת אימוץ במתנה — ${cert.dog}` : `😇 תעודת האימוץ שלך — המלאך השומר של ${cert.dog}`,
    html: shell(gift ? (toRecipient ? 'קיבלת מתנה מיוחדת 🎁' : 'תעודת האימוץ במתנה מוכנה 🎁') : 'תודה שהפכת למלאך השומר 😇',
      `<p>${esc(person.honor_name)} היקר/ה,</p><p>${text}</p>${wa}`, { href: `${SITE}/certificate/${id}`, label: 'לצפייה בתעודה' }),
    replyTo: process.env.MAIL_REPLY_TO || undefined,
    attachments: [{ filename: `תעודת אימוץ - ${cert.dog}.pdf`, content: pdf }],
  })
  await db.from(gift ? 'gifts' : 'sponsorships').update({ [sentField]: new Date().toISOString() }).eq('id', id)
  return { ok: true }
}

// Birthday gift: thank-you email with the birthday dog's thank-you card (/birthday-thanks).
export async function birthdayThanksEmail(db: SupabaseClient, paymentId: string, opts: { auto?: boolean } = {}): Promise<Result> {
  const { data: p } = await db.from('payments').select('id, kind, payer_name, payer_email, paid_at, created_at, email_sent_at').eq('id', paymentId).maybeSingle()
  if (!p || p.kind !== 'birthday') return { ok: false, status: 404, error: 'birthday payment not found' }
  if (opts.auto && p.email_sent_at) return { ok: true, skipped: 'already sent' }
  if (!p.payer_email) return opts.auto ? { ok: true, skipped: 'no email' } : { ok: false, status: 422, error: 'no email for this donor' }
  // Israel time decides the month (a payment at 01:00 on the 1st belongs to the new month)
  const month = Number(new Date(p.paid_at ?? p.created_at).toLocaleString('en-US', { timeZone: 'Asia/Jerusalem', month: 'numeric' }))
  const { data: sched } = await db.from('birthday_schedule').select('dogs(name, slug)').eq('month', month).maybeSingle()
  const dogRow = (sched?.dogs ?? null) as unknown as { name: string; slug: string } | null
  const dog = esc(dogRow?.name ?? 'כלב החודש')
  const first = (p.payer_name ?? '').trim().split(/\s+/)[0] ?? ''
  const link = `${SITE}/birthday-thanks?${new URLSearchParams({ name: first, month: String(month), ...(dogRow ? { dog: dogRow.slug } : {}) })}`
  await sendMail({
    to: p.payer_email,
    subject: `🎂 תודה על המתנה ליום ההולדת של ${dogRow?.name ?? 'הכלב'}!`,
    html: shell('תודה על המתנה! 🎁',
      `<p>${esc(first)} היקר/ה,</p><p>בזכותך יום ההולדת של <b>${dog}</b> היה שמח במיוחד, עם הרבה כשכושי זנב 🐕💛<br>הכנו לך איגרת תודה קטנה.</p>${waNote(`בימים הקרובים תקבל/י מאיתנו גם תודה בוואטסאפ 🐾`)}`,
      { href: link, label: 'לאיגרת התודה' }),
    replyTo: process.env.MAIL_REPLY_TO || undefined,
  })
  await db.from('payments').update({ email_sent_at: new Date().toISOString() }).eq('id', p.id)
  return { ok: true }
}
