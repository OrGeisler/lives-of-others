// Grow (Meshulam) server-to-server notification → payments table.
// URL: https://<project>.supabase.co/functions/v1/grow-webhook?key=<GROW_WEBHOOK_SECRET>
// Grow does not sign requests, so the secret in the URL is the authentication.
// Docs: https://developers.grow.business/docs/webhooks — a paid transaction has statusCode "2" (status "שולם").
import { createClient } from 'npm:@supabase/supabase-js@2'

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const GIFT_SUM = 180
// Grow page reference numbers ("אסמכתא" of each payment page) → what the payment is for
const PAGE_REFS: Record<string, 'virtual' | 'gift' | 'birthday' | 'test'> = { '3842221': 'virtual', '4080981': 'gift', '4080999': 'birthday', '4081106': 'test' }
// Where exactly Grow puts the page reference isn't documented — look for it in every value of the notification
// The real notification (seen 4.10) has no page reference, but paymentDesc carries the chosen item's
// description, so the item names of each Grow page identify it.
const ITEM_KIND: [RegExp, 'virtual' | 'gift' | 'birthday' | 'test'][] = [
  [/^בדיקת/, 'test'],
  [/במתנה/, 'gift'],
  [/עוגת יום הולדת|שק חטיפים|צעצוע חדש|יום פינוק|ארוחת חג|יום הולדת/, 'birthday'],
  [/אוכל איכותי וחטיפים|חיסונים וטיפולים|מצילי חיים|אימוץ וירטואלי/, 'virtual'],
]
const pageKind = (b: Record<string, string>) => {
  for (const v of Object.values(b)) for (const [ref, kind] of Object.entries(PAGE_REFS)) if (v === ref) return kind
  const desc = pick(b, 'paymentDesc', 'productData.0.name', 'description') ?? ''
  return ITEM_KIND.find(([re]) => re.test(desc))?.[1] ?? null
}
const PAID = '2'

// Grow may post JSON or form-encoded ("data[fullName]=…"). Flatten both into { fullName: … }.
async function readBody(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get('content-type') ?? ''
  const out: Record<string, string> = {}
  const put = (k: string, v: unknown) => {
    const key = k.replace(/^data\[|\]$/g, '').replace(/\]\[/g, '.')
    if (v !== null && typeof v === 'object') Object.entries(v as object).forEach(([kk, vv]) => put(`${key}.${kk}`, vv))
    else out[key.replace(/^data\./, '')] = String(v ?? '')
  }
  if (type.includes('application/json')) Object.entries(await req.json()).forEach(([k, v]) => put(k, v))
  else new URLSearchParams(await req.text()).forEach((v, k) => put(k, v))
  return out
}
const pick = (b: Record<string, string>, ...keys: string[]) => keys.map(k => b[k]).find(v => v != null && v !== '') ?? null
// same normalization as public.norm_phone() in the DB
const normPhone = (p: string | null) => (p ?? '').replace(/\D/g, '').replace(/^(00)?972/, '0') || null
// Grow sends paymentDate as dd/mm/yy
const parseDate = (s: string | null) => {
  const m = s?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!m) return new Date().toISOString()
  const y = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])
  return new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[1]), 9)).toISOString()
}

async function approve(b: Record<string, string>, txId: string | null, sum: number | null) {
  // Tells Grow we received it (needs API credentials; skipped until they exist). Grow re-sends until approved.
  const userId = Deno.env.get('GROW_USER_ID'), pageCode = Deno.env.get('GROW_PAGE_CODE_ONETIME')
  if (!userId || !pageCode || !txId) return
  const env = Deno.env.get('GROW_SANDBOX') === 'false' ? 'secure' : 'sandbox'
  const form = new URLSearchParams({ userId, pageCode, transactionId: txId, transactionToken: pick(b, 'transactionToken') ?? '', sum: String(sum ?? '') })
  await fetch(`https://${env}.meshulam.co.il/api/light/server/1.0/approveTransaction`, { method: 'POST', body: form }).catch(e => console.error('approve failed', e))
}

Deno.serve(async req => {
  const url = new URL(req.url)
  if (req.method !== 'POST') return new Response('ok')
  if (!Deno.env.get('GROW_WEBHOOK_SECRET') || url.searchParams.get('key') !== Deno.env.get('GROW_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 })
  }

  const b = await readBody(req)
  const txId = pick(b, 'transactionId', 'transactionCode')
  const sum = Number(pick(b, 'paymentSum', 'sum')) || null
  const phone = normPhone(pick(b, 'payerPhone', 'phone'))
  const statusCode = pick(b, 'statusCode')
  // the after-transaction webhook is only sent for completed payments and carries no statusCode
  const paid = statusCode == null || statusCode === PAID
  const paidAt = parseDate(pick(b, 'paymentDate'))

  // A re-sent notification: already recorded → no side effects again, just re-approve.
  if (txId) {
    const { data: seen } = await db.from('payments').select('id').eq('grow_transaction_id', txId).maybeSingle()
    if (seen) { await approve(b, txId, sum); return new Response('ok') }
  }

  const row: Record<string, unknown> = {
    kind: 'donation', status: pick(b, 'status', 'statusCode'), sum,
    grow_transaction_id: txId, asmachta: pick(b, 'asmachta'),
    payer_name: pick(b, 'invoiceName', 'fullName', 'payerFullName'), payer_phone: pick(b, 'payerPhone', 'phone'), payer_email: pick(b, 'payerEmail', 'email'),
    source_link: pick(b, 'paymentLinkProcessId', 'processId', 'pageCode'),
    receipt_url: pick(b, 'invoiceURL', 'invoiceUrl', 'invoiceLink'),
    raw: b, paid_at: paidAt, needs_review: true,
  }

  // Auto-match only successful payments, by phone. One person may have several donor rows (one per checkout).
  // Priority: an existing (active/failed) sponsorship with this monthly sum → a pending one from our checkout → a pending 180 ₪ gift.
  let after: (() => Promise<unknown>) | null = null
  let page = pageKind(b)
  // test page (4081106): 1 ₪ = adoption, 2 ₪ = gift, 3 ₪ = birthday — matched exactly like the real flows, any tier
  const isTest = page === 'test'
  if (isTest) {
    const desc = pick(b, 'paymentDesc') ?? ''
    page = /מתנה/.test(desc) || sum === 2 ? 'gift' : /יום הולדת/.test(desc) || sum === 3 ? 'birthday' : 'virtual'
    row.source_link = 'TEST'
  }
  if (page === 'birthday') Object.assign(row, { kind: 'birthday', needs_review: false }) // never an adoption, even at 25/50
  if (paid && phone && sum && page !== 'birthday') {
    const { data: donors } = await db.from('donors').select('id').eq('phone_norm', phone)
    const ids = (donors ?? []).map(d => d.id)
    if (ids.length) {
      const { data: sps } = await db.from('sponsorships').select('id, donor_id, dog_id, tier, status, started_at, created_at')
        .in('donor_id', ids).in('status', ['active', 'failed', 'pending']).in('tier', isTest ? [25, 50, 100] : [sum])
      // real money: an existing adoption first (monthly charge); test payments: the newest form first
      const rank = (s: string) => isTest ? (s === 'pending' ? 0 : 1) : (s === 'active' ? 0 : s === 'failed' ? 1 : 2)
      const sp = page === 'gift' ? undefined : (sps ?? []).sort((a, c) => rank(a.status) - rank(c.status) || c.created_at.localeCompare(a.created_at))[0]
      if (sp) {
        Object.assign(row, { kind: 'virtual', donor_id: sp.donor_id, dog_id: sp.dog_id, sponsorship_id: sp.id, needs_review: false })
        after = () => db.from('sponsorships').update({ status: 'active', last_payment_at: paidAt, started_at: sp.started_at ?? paidAt }).eq('id', sp.id)
      } else if (sum === GIFT_SUM || page === 'gift') {
        const { data: gifts } = await db.from('gifts').select('id, buyer_donor_id, dog_id')
          .in('buyer_donor_id', ids).eq('status', 'pending').order('created_at', { ascending: false }).limit(1)
        const g = gifts?.[0]
        if (g) {
          Object.assign(row, { kind: 'gift', donor_id: g.buyer_donor_id, dog_id: g.dog_id, gift_id: g.id, needs_review: false })
          after = () => db.from('gifts').update({ status: 'paid' }).eq('id', g.id)
        }
      }
    }
  }

  if (row.needs_review && !page && sum && ![25, 50, 100, 180].includes(sum)) row.needs_review = false // a regular donation

  // Insert first (unique grow_transaction_id): if a parallel duplicate won the race, skip the side effects.
  const { error } = await db.from('payments').insert(row)
  if (error) {
    if (error.code === '23505') { await approve(b, txId, sum); return new Response('ok') }
    console.error('payments insert failed', error.message)
    return new Response('error', { status: 500 })
  }
  if (after) await after()
  await approve(b, txId, sum)
  return new Response('ok')
})
