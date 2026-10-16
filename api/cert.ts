import type { VercelRequest, VercelResponse } from '@vercel/node'
import pdf from './_lib/h-pdf.js'
import send from './_lib/h-send.js'
import cron from './_lib/h-cron.js'

// ONE function for everything that needs Chromium: Vercel stores every deployment's function bundles, and each
// Chromium function is ~70MB, so three of them filled the free "Function Storage" quota (Oct 2026).
// The public URLs stay the same through vercel.json rewrites:
//   /api/certificate-pdf → ?op=pdf · /api/send-certificate → ?op=send · /api/cron-gift-recipients → ?op=cron
export const config = { maxDuration: 300 }

export default function handler(req: VercelRequest, res: VercelResponse) {
  const op = String(req.query.op ?? '')
  if (op === 'pdf') return pdf(req, res)
  if (op === 'send') return send(req, res)
  if (op === 'cron') return cron(req, res)
  return res.status(404).json({ error: 'unknown op' })
}
