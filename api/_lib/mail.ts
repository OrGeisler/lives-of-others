// Minimal Resend client (https://resend.com/docs/api-reference/emails/send-email)
export async function sendMail(opts: {
  to: string; subject: string; html: string; replyTo?: string
  attachments?: { filename: string; content: Buffer }[]
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'חיים של אחרים <onboarding@resend.dev>',
      to: [opts.to], subject: opts.subject, html: opts.html, reply_to: opts.replyTo,
      attachments: opts.attachments?.map(a => ({ filename: a.filename, content: a.content.toString('base64') })),
    }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Resend ${res.status}: ${JSON.stringify(body)}`)
  return body as { id: string }
}

export const esc = (s: string | null | undefined) =>
  (s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
