import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// /certificate/:id is rewritten here so a link sent on WhatsApp shows a preview (the dog's photo and
// "תעודת אימוץ…") instead of the generic site card. Same page as before: the SPA shell with tags injected.
const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })
const SITE = process.env.SITE_URL || 'https://lives-of-others.com'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id ?? '')
  const shell = await fetch(`${SITE}/spa.html`).then(r => r.text())
  const { data: cert } = /^[0-9a-f-]{36}$/.test(id) ? await db.rpc('get_certificate', { p_id: id }) : { data: null }
  let html = shell
  if (cert) {
    const title = cert.type === 'gift' ? `🎁 תעודת אימוץ במתנה: ${cert.dog} — עבור ${cert.name}` : `😇 תעודת אימוץ: ${cert.name} — המלאך השומר של ${cert.dog}`
    const desc = 'לחצו לצפייה בתעודה ולהורדה · עמותת חיים של אחרים'
    const tags = [
      `<title>${esc(title)}</title>`, `<meta name="robots" content="noindex" />`,
      `<meta property="og:title" content="${esc(title)}" />`, `<meta property="og:description" content="${esc(desc)}" />`,
      `<meta property="og:url" content="${SITE}/certificate/${id}" />`,
      cert.image ? `<meta property="og:image" content="${esc(cert.image)}" />` : '',
    ].join('\n    ')
    html = shell.replace(/<title>[\s\S]*?<\/title>/, '').replace(/\s*<meta (name="description"|property="og:[a-z]+")[^>]*>/g, '').replace('</head>', `    ${tags}\n  </head>`)
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=0, must-revalidate')
  return res.status(200).send(html)
}
