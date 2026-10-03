import { useEffect, useState } from 'react'
import { TIER_AMOUNTS } from '../../lib/constants'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import { Empty, Field, Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { fmtDate, shekel } from '../util'

type Payment = {
  id: string; kind: string; sum: number | null; status: string | null; asmachta: string | null; receipt_url: string | null
  payer_name: string | null; payer_phone: string | null; payer_email: string | null; needs_review: boolean
  paid_at: string | null; created_at: string; dogs?: { name: string } | null
}
const KIND: Record<string, string> = { virtual: 'אימוץ וירטואלי', gift: 'מתנה', birthday: 'יום הולדת', donation: 'תרומה', memorial: 'הנצחה', items: 'ציוד' }

export default function Payments() {
  const dogs = useDogsLite()
  const [list, setList] = useState<Payment[] | null>(null)
  const [match, setMatch] = useState<Payment | null>(null)
  const [dogId, setDogId] = useState('')
  const [tier, setTier] = useState(50)

  const refresh = async () => {
    const { data } = await supabase.from('payments').select('*, dogs(name)').order('needs_review', { ascending: false }).order('created_at', { ascending: false }).limit(200)
    setList((data ?? []) as Payment[])
  }
  useEffect(() => { refresh() }, [])

  // Candidates a payment can be linked to: adoptions/gifts that filled our form but are still waiting for payment
  type Cand = { id: string; label: string; sub: string; phone: string | null }
  const [cands, setCands] = useState<{ sps: Cand[]; gifts: Cand[] }>({ sps: [], gifts: [] })
  const openMatch = async (p: Payment) => {
    setMatch(p); setDogId(''); setTier(TIER_AMOUNTS.includes(Number(p.sum)) ? Number(p.sum) : 50)
    const [sp, gf] = await Promise.all([
      supabase.from('sponsorships').select('id, tier, status, donors(honor_name, phone), dogs(name)').in('status', ['pending', 'failed']).order('created_at', { ascending: false }),
      supabase.from('gifts').select('id, recipient_name, donors(honor_name, phone), dogs(name)').eq('status', 'pending').order('created_at', { ascending: false }),
    ])
    type SpRow = { id: string; tier: number; status: string; donors: { honor_name: string | null; phone: string | null } | null; dogs: { name: string } | null }
    type GRow = { id: string; recipient_name: string | null; donors: { honor_name: string | null; phone: string | null } | null; dogs: { name: string } | null }
    setCands({
      sps: ((sp.data ?? []) as unknown as SpRow[]).map(x => ({ id: x.id, label: `${x.donors?.honor_name ?? '—'} · ${x.dogs?.name ?? ''}`, sub: `${x.tier} ₪ לחודש${x.status === 'failed' ? ' · חיוב נכשל' : ' · ממתין'}`, phone: x.donors?.phone ?? null })),
      gifts: ((gf.data ?? []) as unknown as GRow[]).map(x => ({ id: x.id, label: `${x.donors?.honor_name ?? '—'} → ${x.recipient_name ?? ''}`, sub: `מתנה · ${x.dogs?.name ?? ''}`, phone: x.donors?.phone ?? null })),
    })
  }
  const done = (msg: string) => { toast(msg); setMatch(null); refresh() }
  const linkSp = async (id: string) => { if (!fail((await supabase.rpc('link_payment_to_sponsorship', { p_payment: match!.id, p_sponsorship: id })).error, 'השיוך')) done('שויך — האימוץ פעיל ✓') }
  const linkGift = async (id: string) => { if (!fail((await supabase.rpc('link_payment_to_gift', { p_payment: match!.id, p_gift: id })).error, 'השיוך')) done('שויך למתנה ✓') }
  const asVirtual = async () => {
    if (!dogId) { toast('בחרו כלב', true); return }
    if (!fail((await supabase.rpc('payment_new_sponsorship', { p_payment: match!.id, p_dog: dogId, p_tier: tier })).error, 'השיוך')) done('נוסף מאמץ וירטואלי חדש ✓')
  }
  const asKind = async (p: Payment, kind: string) => {
    if (!confirm('לסמן את התשלום כתרומה רגילה (לא אימוץ ולא מתנה)?')) return
    if (!fail((await supabase.from('payments').update({ kind, needs_review: false }).eq('id', p.id)).error, 'השיוך')) { toast('עודכן ✓'); refresh() }
  }
  const samePhone = (c: Cand) => !!match?.payer_phone && !!c.phone && c.phone.replace(/\D/g, '').slice(-9) === match.payer_phone.replace(/\D/g, '').slice(-9)

  return (
    <>
      <PageHead title="תשלומים" />
      <Help>
        כל תשלום שמגיע מ-Grow נרשם כאן אוטומטית <b>(יופעל אחרי החיבור ל-Grow)</b>.
        כשהמערכת לא יודעת לשייך תשלום לבד — הוא מופיע למעלה עם <b>"צריך שיוך"</b>, ובוחרים אם זה אימוץ וירטואלי (ולאיזה כלב) או תרומה רגילה.
      </Help>
      {!list ? <p>טוען…</p> : list.length === 0 ? <Empty>עדיין אין תשלומים. אחרי החיבור ל-Grow הם יופיעו כאן לבד.</Empty> : (
        <div className="ad-list">
          {list.map(p => (
            <div key={p.id} className={`ad-row${p.needs_review ? ' review' : ''}`}>
              <div className="ad-row-main">
                <b>{p.payer_name ?? '—'} · {shekel(p.sum)}</b>
                <span>{KIND[p.kind] ?? p.kind}{p.dogs?.name ? ` · ${p.dogs.name}` : ''} · {fmtDate(p.paid_at ?? p.created_at)}{p.asmachta ? ` · אסמכתא ${p.asmachta}` : ''}</span>
                <span className="ad-muted" dir="ltr">{[p.payer_phone, p.payer_email].filter(Boolean).join(' · ')}</span>
              </div>
              {p.receipt_url && <a className="ad-btn ghost sm" href={p.receipt_url} target="_blank" rel="noopener">🧾 קבלה</a>}
              {p.needs_review && (
                <div className="ad-row-actions">
                  <span className="ad-tag st-failed">צריך שיוך</span>
                  <button className="ad-btn primary sm" onClick={() => openMatch(p)}>🔗 שיוך</button>
                  <button className="ad-btn sm" onClick={() => asKind(p, 'donation')}>תרומה רגילה</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {match && (
        <Modal title="למה שייך התשלום?" onClose={() => setMatch(null)}>
          <div className="ad-form">
            <p><b>{match.payer_name ?? '—'}</b> · {shekel(match.sum)} <span className="ad-muted" dir="ltr">{match.payer_phone}</span></p>
            {cands.sps.length + cands.gifts.length > 0 && (
              <>
                <h3>1. מישהו שמילא טופס באתר ומחכה לתשלום</h3>
                <p className="ad-hint">⭐ = אותו מספר טלפון</p>
                <div className="ad-list">
                  {[...cands.sps.map(c => ({ ...c, k: 'sp' })), ...cands.gifts.map(c => ({ ...c, k: 'g' }))]
                    .sort((a, b) => Number(samePhone(b)) - Number(samePhone(a)))
                    .map(c => (
                      <button key={c.k + c.id} className="ad-row clickable ad-pick" onClick={() => (c.k === 'sp' ? linkSp(c.id) : linkGift(c.id))}>
                        <span className="ad-row-main"><b>{samePhone(c) ? '⭐ ' : ''}{c.label}</b><span className="ad-muted">{c.sub} · <span dir="ltr">{c.phone}</span></span></span>
                        <span className="ad-btn primary sm">שיוך</span>
                      </button>
                    ))}
                </div>
              </>
            )}
            <h3>{cands.sps.length + cands.gifts.length > 0 ? '2. ' : ''}מאמץ וירטואלי חדש</h3>
            <div className="ad-grid2">
              <Field label="איזה כלב?">
                <select value={dogId} onChange={e => setDogId(e.target.value)}>
                  <option value="">— לבחירה —</option>
                  {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="סכום חודשי">
                <select value={tier} onChange={e => setTier(Number(e.target.value))}>
                  {TIER_AMOUNTS.map(a => <option key={a} value={a}>{a} ₪</option>)}
                </select>
              </Field>
            </div>
            <div className="ad-form-actions">
              <button className="ad-btn primary" onClick={asVirtual}>➕ יצירת מאמץ חדש</button>
              <button className="ad-btn ghost" onClick={() => setMatch(null)}>ביטול</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
