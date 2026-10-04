import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { certificatePdf } from './_lib/pdf.js'

// GET /api/certificate-pdf?id=<uuid> — public download of a (paid) certificate as an A4-landscape PDF.
// The id is an unguessable uuid and get_certificate only returns paid/active certificates.
export const config = { maxDuration: 60 }

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } })
const SITE = process.env.SITE_URL || 'https://lives-of-others.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id)) return res.status(400).send('bad id')
  const { data: cert } = await db.rpc('get_certificate', { p_id: id })
  if (!cert) return res.status(404).send('not found')
  const pdf = await certificatePdf(SITE, id)
  const name = `תעודת אימוץ - ${cert.dog ?? ''}.pdf`
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="certificate.pdf"; filename*=UTF-8''${encodeURIComponent(name)}`)
  res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=60')
  return res.status(200).send(pdf)
}
