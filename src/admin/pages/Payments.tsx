import { useEffect, useState } from 'react'
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

  // Turn an unmatched Grow payment into a donor + active virtual adoption
  const asVirtual = async () => {
    if (!match) return
    const d = await supabase.from('donors').insert({ honor_name: match.payer_name, phone: match.payer_phone, email: match.payer_email }).select('id').single()
    if (fail(d.error, 'השיוך')) return
    const s = await supabase.from('sponsorships').insert({
      donor_id: d.data!.id, dog_id: dogId || null, tier, status: 'active', started_at: match.paid_at ?? match.created_at, last_payment_at: match.paid_at ?? match.created_at,
    }).select('id').single()
    if (fail(s.error, 'השיוך')) return
    if (fail((await supabase.from('payments').update({ kind: 'virtual', donor_id: d.data!.id, dog_id: dogId || null, sponsorship_id: s.data!.id, needs_review: false }).eq('id', match.id)).error, 'השיוך')) return
    toast('נוסף כמאמץ וירטואלי ✓'); setMatch(null); refresh()
  }
  const asKind = async (p: Payment, kind: string) => {
    if (!fail((await supabase.from('payments').update({ kind, needs_review: false }).eq('id', p.id)).error, 'השיוך')) { toast('עודכן ✓'); refresh() }
  }

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
                  <button className="ad-btn primary sm" onClick={() => { setMatch(p); setDogId(''); setTier(Number(p.sum) || 50) }}>😇 אימוץ וירטואלי</button>
                  <button className="ad-btn sm" onClick={() => asKind(p, 'donation')}>תרומה רגילה</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {match && (
        <Modal title="שיוך לאימוץ וירטואלי" onClose={() => setMatch(null)}>
          <div className="ad-form">
            <p><b>{match.payer_name}</b> · {shekel(match.sum)}</p>
            <Field label="איזה כלב אומץ?">
              <select value={dogId} onChange={e => setDogId(e.target.value)}>
                <option value="">— לבחירה —</option>
                {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="סכום חודשי">
              <select value={tier} onChange={e => setTier(Number(e.target.value))}>
                <option value={25}>25 ₪</option><option value={50}>50 ₪</option><option value={100}>100 ₪</option>
              </select>
            </Field>
            <div className="ad-form-actions">
              <button className="ad-btn primary big" onClick={asVirtual}>שיוך ✓</button>
              <button className="ad-btn ghost" onClick={() => setMatch(null)}>ביטול</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
