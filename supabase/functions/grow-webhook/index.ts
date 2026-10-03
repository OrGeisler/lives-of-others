// Grow (Meshulam) server-to-server notification → payments table.
// URL: https://<project>.supabase.co/functions/v1/grow-webhook?key=<GROW_WEBHOOK_SECRET>
// Grow does not sign requests, so the secret in the URL is the authentication.
// Docs: https://developers.grow.business/docs/webhooks
import { createClient } from 'npm:@supabase/supabase-js@2'

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })

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
const GIFT_SUM = 180
const digits = (p: string | null) => (p ?? '').replace(/\D/g, '').replace(/^972/, '0')

Deno.serve(async req => {
  const url = new URL(req.url)
  if (req.method !== 'POST') return new Response('ok')
  if (!Deno.env.get('GROW_WEBHOOK_SECRET') || url.searchParams.get('key') !== Deno.env.get('GROW_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 })
  }

  const b = await readBody(req)
  const txId = pick(b, 'transactionId', 'transactionCode', 'asmachta')
  const sum = Number(pick(b, 'sum', 'paymentSum')) || null
  const phone = pick(b, 'payerPhone', 'phone')
  const statusCode = pick(b, 'statusCode', 'status')
  const paidAt = new Date().toISOString()

  const row = {
    kind: 'donation', status: statusCode, sum,
    grow_transaction_id: txId, asmachta: pick(b, 'asmachta'),
    payer_name: pick(b, 'fullName', 'payerFullName', 'cField1Name'),
    payer_phone: phone, payer_email: pick(b, 'payerEmail', 'email'),
    source_link: pick(b, 'paymentLinkProcessId', 'processId', 'pageCode'),
    receipt_url: pick(b, 'invoiceUrl', 'invoiceLink'),
    raw: b, paid_at: paidAt, needs_review: true,
  }

  // Auto-match by phone. One person may have several donor rows (one per checkout), so look across all of them:
  // 1) a sponsorship (pending from our checkout / active / failed) with the same monthly sum → mark active
  // 2) otherwise a pending gift (180 ₪) bought through our checkout → mark paid
  if (phone && sum) {
    const { data: donors } = await db.from('donors').select('id, phone')
    const ids = (donors ?? []).filter(d => digits(d.phone) && digits(d.phone) === digits(phone)).map(d => d.id)
    if (ids.length) {
      const { data: sps } = await db.from('sponsorships').select('id, donor_id, dog_id, tier, status, started_at')
        .in('donor_id', ids).in('status', ['active', 'failed', 'pending']).order('created_at', { ascending: false })
      const sp = (sps ?? []).find(x => Number(x.tier) === sum)
      if (sp) {
        Object.assign(row, { kind: 'virtual', donor_id: sp.donor_id, dog_id: sp.dog_id, sponsorship_id: sp.id, needs_review: false })
        await db.from('sponsorships').update({ status: 'active', last_payment_at: paidAt, started_at: sp.started_at ?? paidAt }).eq('id', sp.id)
      } else if (sum === GIFT_SUM) {
        const { data: gifts } = await db.from('gifts').select('id, buyer_donor_id, dog_id')
          .in('buyer_donor_id', ids).eq('status', 'pending').order('created_at', { ascending: false }).limit(1)
        if (gifts?.[0]) {
          Object.assign(row, { kind: 'gift', donor_id: gifts[0].buyer_donor_id, dog_id: gifts[0].dog_id, gift_id: gifts[0].id, needs_review: false })
          await db.from('gifts').update({ status: 'paid' }).eq('id', gifts[0].id)
        }
      }
    }
  }

  const { error } = txId
    ? await db.from('payments').upsert(row, { onConflict: 'grow_transaction_id', ignoreDuplicates: true }) // Grow re-sends until approved
    : await db.from('payments').insert(row)
  if (error) { console.error('payments insert failed', error.message); return new Response('error', { status: 500 }) }

  // Tell Grow we received it (needs API credentials; skipped until they exist).
  const userId = Deno.env.get('GROW_USER_ID'), pageCode = Deno.env.get('GROW_PAGE_CODE_ONETIME')
  if (userId && pageCode && txId) {
    const env = Deno.env.get('GROW_SANDBOX') === 'false' ? 'secure' : 'sandbox'
    const form = new URLSearchParams({ userId, pageCode, transactionId: txId, transactionToken: pick(b, 'transactionToken') ?? '', sum: String(sum ?? '') })
    await fetch(`https://${env}.meshulam.co.il/api/light/server/1.0/approveTransaction`, { method: 'POST', body: form }).catch(e => console.error('approve failed', e))
  }
  return new Response('ok')
})
