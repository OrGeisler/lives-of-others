import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { certificatePdf } from './pdf.js'

// GET /api/certificate-pdf?id=<uuid>[&format=jpg] — public download of a (paid) certificate as an A4-landscape PDF.
// The id is an unguessable uuid and get_certificate only returns paid/active certificates.

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })
const SITE = process.env.SITE_URL || 'https://lives-of-others.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).send('bad id')
  const { data: cert } = await db.rpc('get_certificate', { p_id: id })
  if (!cert) return res.status(404).send('not found')
  const jpg = req.query.format === 'jpg'
  const file = await certificatePdf(SITE, id, jpg ? 'jpg' : 'pdf')
  const name = `תעודת אימוץ - ${cert.dog ?? ''}.${jpg ? 'jpg' : 'pdf'}`
  res.setHeader('Content-Type', jpg ? 'image/jpeg' : 'application/pdf')
  res.setHeader('Content-Disposition', `${jpg ? 'inline' : 'attachment'}; filename="certificate.${jpg ? 'jpg' : 'pdf'}"; filename*=UTF-8''${encodeURIComponent(name)}`)
  res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=60')
  return res.status(200).send(file)
}
