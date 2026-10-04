// Public checkout: saves the donor's details (as "pending") BEFORE sending them to pay,
// so the nonprofit sees every adoption/gift in the admin even before Grow confirms the payment.
// The grow-webhook later flips the record to active/paid by matching phone + sum.
// When Grow API credentials exist, this is where createPaymentProcess will be called instead of
// returning the static payment-link URL.
import { createClient } from 'npm:@supabase/supabase-js@2'

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const ALLOWED_ORIGINS = ['https://lives-of-others.com', 'https://www.lives-of-others.com', 'https://lives-of-others-app.vercel.app', 'http://localhost:5173', 'http://localhost:4173']
const SOURCES = ['friends', 'facebook', 'instagram', 'volunteering', 'news', 'other']
const GIFT_SUM = 180

const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
})
const str = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const phoneOk = (p: string) => /^(\+?972|0)5\d{8}$/.test(p.replace(/[\s-]/g, ''))
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

Deno.serve(async req => {
  const origin = req.headers.get('origin')
  const headers = { ...cors(origin), 'Content-Type': 'application/json' }
  if (req.method === 'OPTIONS') return new Response('ok', { headers })
  if (req.method !== 'POST') return new Response('{}', { status: 405, headers })
  const bad = (error: string) => new Response(JSON.stringify({ error }), { status: 400, headers })

  let b: Record<string, unknown>
  try { b = await req.json() } catch { return bad('בקשה לא תקינה') }
  if (str(b.website)) return new Response(JSON.stringify({ redirect: '/' }), { headers }) // honeypot: bots fill hidden fields

  const type = b.type === 'gift' ? 'gift' : 'virtual'
  const honor = str(b.honor_name, 80), phone = str(b.phone, 20), email = str(b.email, 120)
  const source = SOURCES.includes(str(b.source)) ? str(b.source) : null
  if (!honor) return bad('נא למלא שם לכבוד')
  if (!phoneOk(phone)) return bad('מספר הטלפון לא תקין')
  if (!emailOk(email)) return bad('כתובת המייל לא תקינה')
  if (b.consent_terms !== true) return bad('יש לאשר את התקנון ומדיניות הפרטיות')

  const { data: dog } = await db.from('dogs').select('id, name, grow_virtual_link, available_for_virtual, available_for_gift, active').eq('slug', str(b.dog, 60)).maybeSingle()
  if (!dog || !dog.active || (type === 'virtual' ? !dog.available_for_virtual : !dog.available_for_gift)) return bad('הכלב שנבחר לא זמין כרגע')

  let tier = 0
  if (type === 'virtual') {
    tier = Number(b.tier)
    if (![25, 50, 100].includes(tier)) return bad('נא לבחור מסלול')
  }
  const recipient = (b.gift ?? {}) as Record<string, unknown>
  if (type === 'gift') {
    if (!str(recipient.name)) return bad('נא למלא את שם מקבל/ת המתנה')
    if (str(recipient.phone) && !phoneOk(str(recipient.phone))) return bad('הטלפון של מקבל/ת המתנה לא תקין')
    if (str(recipient.email) && !emailOk(str(recipient.email))) return bad('המייל של מקבל/ת המתנה לא תקין')
  }

  const donor = await db.from('donors').insert({
    honor_name: honor, phone, email, source, consent_terms_at: new Date().toISOString(), consent_marketing: b.consent_marketing === true,
  }).select('id').single()
  if (donor.error) return new Response(JSON.stringify({ error: 'שגיאה בשמירה, נסו שוב' }), { status: 500, headers })

  if (type === 'virtual') {
    const r = await db.from('sponsorships').insert({ donor_id: donor.data.id, dog_id: dog.id, tier, status: 'pending' })
    if (r.error) return new Response(JSON.stringify({ error: 'שגיאה בשמירה, נסו שוב' }), { status: 500, headers })
  } else {
    const sendAt = str(recipient.send_at, 10)
    const r = await db.from('gifts').insert({
      buyer_donor_id: donor.data.id, dog_id: dog.id, status: 'pending',
      recipient_name: str(recipient.name, 80), recipient_phone: str(recipient.phone, 20) || null, recipient_email: str(recipient.email, 120) || null,
      greeting: str(recipient.greeting, 600) || null, send_at: /^\d{4}-\d{2}-\d{2}$/.test(sendAt) ? `${sendAt}T09:00:00+03:00` : null,
    })
    if (r.error) return new Response(JSON.stringify({ error: 'שגיאה בשמירה, נסו שוב' }), { status: 500, headers })
  }

  const { data: links } = await db.from('site_settings').select('value').eq('key', 'links').maybeSingle()
  const L = (links?.value ?? {}) as { grow_virtual?: string; grow_gift?: string }
  const redirect = type === 'gift' ? L.grow_gift : (dog.grow_virtual_link || L.grow_virtual)
  return new Response(JSON.stringify({ redirect, sum: type === 'gift' ? GIFT_SUM : tier }), { headers })
})
