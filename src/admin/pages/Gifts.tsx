import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import type { Gift } from '../types'
import { Empty, Field, Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { sendCertificate } from '../certificate'
import { fmtDate, waLink } from '../util'
import { localDate } from '../../lib/constants'

const GIFT_STATUS: Record<Gift['status'], string> = { pending: 'ממתין לתשלום', paid: 'שולם', sent: 'נשלח', canceled: 'בוטל' }

type Form = {
  id?: string; buyer_donor_id?: string | null; status: Gift['status']
  buyer_name: string; buyer_phone: string; buyer_email: string
  dog_id: string; recipient_name: string; recipient_phone: string; recipient_email: string; greeting: string; send_at: string
}
const blank = (): Form => ({
  status: 'paid', buyer_name: '', buyer_phone: '', buyer_email: '', dog_id: '', recipient_name: '', recipient_phone: '',
  recipient_email: '', greeting: '', send_at: localDate(),
})

const giftMessage = (g: Gift) =>
  `היי ${g.recipient_name ?? ''}! 🎁\n${g.donors?.honor_name ?? 'מישהו שאוהב אותך'} העניק/ה לך מתנה מיוחדת: אימוץ וירטואלי של ${g.dogs?.name ?? 'אחד הכלבים'} מעמותת חיים של אחרים 🐾\n\n${g.greeting ? `"${g.greeting}"\n\n` : ''}במשך השנה הקרובה ${g.dogs?.name ?? 'הכלב'} ישלח לך עדכון פעם בחודש 💛`

export default function Gifts() {
  const dogs = useDogsLite()
  const [list, setList] = useState<Gift[] | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [err, setErr] = useState('')

  const refresh = async () => {
    const { data, error } = await supabase.from('gifts').select('*, donors(*), dogs(id,slug,name,main_image)').order('send_at')
    setErr(error ? 'לא הצלחנו לטעון את המתנות. בדקו את החיבור לאינטרנט ונסו לרענן.' : '')
    setList((data ?? []) as Gift[])
  }
  useEffect(() => { refresh() }, [])

  const today = new Date(); today.setHours(23, 59, 59, 999)
  const toSend = useMemo(() => (list ?? []).filter(g => g.status === 'paid' && !g.sent_at && g.send_at && new Date(g.send_at) <= today), [list])
  const later = useMemo(() => (list ?? []).filter(g => g.status === 'paid' && !g.sent_at && (!g.send_at || new Date(g.send_at) > today)), [list])
  const unpaid = useMemo(() => (list ?? []).filter(g => g.status === 'pending'), [list])
  const canceled = useMemo(() => (list ?? []).filter(g => g.status === 'canceled'), [list])
  const restore = async (g: Gift) => {
    if (!fail((await supabase.from('gifts').update({ status: g.sent_at ? 'sent' : 'paid' }).eq('id', g.id)).error, 'השחזור')) { toast('המתנה שוחזרה ✓'); refresh() }
  }
  const sent = useMemo(() => (list ?? []).filter(g => g.sent_at && g.status !== 'canceled'), [list])

  const markSent = async (g: Gift) => {
    if (!fail((await supabase.from('gifts').update({ sent_at: new Date().toISOString(), status: 'sent' }).eq('id', g.id)).error, 'הסימון')) {
      toast('המתנה סומנה כנשלחה ✓ — מעכשיו היא תופיע גם בעדכונים החודשיים'); refresh()
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    const donor = { honor_name: form.buyer_name.trim(), phone: form.buyer_phone.trim() || null, email: form.buyer_email.trim() || null }
    let buyer = form.buyer_donor_id
    if (buyer) { if (fail((await supabase.from('donors').update(donor).eq('id', buyer)).error, 'השמירה')) return }
    else {
      const r = await supabase.from('donors').insert(donor).select('id').single()
      if (fail(r.error, 'השמירה')) return
      buyer = r.data!.id
    }
    const gift = {
      buyer_donor_id: buyer, dog_id: form.dog_id || null, recipient_name: form.recipient_name.trim() || null,
      recipient_phone: form.recipient_phone.trim() || null, recipient_email: form.recipient_email.trim() || null,
      greeting: form.greeting.trim() || null, send_at: form.send_at ? new Date(form.send_at + 'T09:00:00').toISOString() : null,
      status: form.status,
    }
    const r = form.id ? await supabase.from('gifts').update(gift).eq('id', form.id) : await supabase.from('gifts').insert(gift)
    if (!fail(r.error, 'השמירה')) { toast('נשמר ✓'); setForm(null); refresh() }
  }
  const edit = (g: Gift) => setForm({
    id: g.id, status: g.status, buyer_donor_id: g.buyer_donor_id, buyer_name: g.donors?.honor_name ?? '', buyer_phone: g.donors?.phone ?? '',
    buyer_email: g.donors?.email ?? '', dog_id: g.dog_id ?? '', recipient_name: g.recipient_name ?? '',
    recipient_phone: g.recipient_phone ?? '', recipient_email: g.recipient_email ?? '', greeting: g.greeting ?? '',
    send_at: g.send_at ? localDate(new Date(g.send_at)) : '',
  })
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => f && { ...f, [k]: v })

  const card = (g: Gift, actions: boolean) => {
    const wa = waLink(g.recipient_phone, giftMessage(g))
    return (
      <div key={g.id} className="ad-row clickable" role="button" tabIndex={0} onClick={() => edit(g)} onKeyDown={e => { if (e.key === 'Enter') edit(g) }}>
        {g.dogs?.main_image && <img className="ad-thumb" src={g.dogs.main_image} alt="" />}
        <div className="ad-row-main">
          <b>🎁 ל{g.recipient_name ?? '—'}</b>
          <span>מאת {g.donors?.honor_name ?? '—'} · {g.dogs?.name ?? 'ללא כלב'} · {g.sent_at ? `נשלח ${fmtDate(g.sent_at)}` : `לשליחה ב-${fmtDate(g.send_at)}`}</span>
          {g.greeting && <span className="ad-muted">"{g.greeting}"</span>}
          {(g.status === 'paid' || g.status === 'sent') && !g.certificate_sent_at && <span className="ad-tag gold">📜 תעודה עוד לא נשלחה</span>}
        </div>
        {(g.status === 'paid' || g.status === 'sent') && (
          <div className="ad-row-actions" onClick={e => e.stopPropagation()}>
            <a className="ad-btn sm ghost" href={`/certificate/${g.id}`} target="_blank" rel="noopener" title={g.certificate_sent_at ? `נשלחה ${fmtDate(g.certificate_sent_at)}` : 'עוד לא נשלחה'}>📜 תעודה</a>
            <button className="ad-btn sm" title="שליחת התעודה לקונה במייל" onClick={async () => { const e = await sendCertificate(g.id); if (e) toast(e, true); else { toast('התעודה נשלחה לקונה במייל ✓'); refresh() } }}>📧 לקונה</button>
            {g.recipient_email && (
              <button className="ad-btn sm primary" title={g.recipient_certificate_sent_at ? `נשלחה ${fmtDate(g.recipient_certificate_sent_at)}` : 'שליחת התעודה והברכה ישירות למקבל/ת המתנה'}
                onClick={async () => { if (!confirm(`לשלוח את תעודת המתנה והברכה ל${g.recipient_name ?? ''} (${g.recipient_email})?`)) return; const e = await sendCertificate(g.id, 'recipient'); if (e) toast(e, true); else { toast(`התעודה נשלחה ל${g.recipient_name ?? 'מקבל/ת המתנה'} ✓`); refresh() } }}>
                📧 למקבל/ת{g.recipient_certificate_sent_at ? ' ✓' : ''}
              </button>
            )}
          </div>
        )}
        {actions && (
          <div className="ad-row-actions" onClick={e => e.stopPropagation()}>
            {wa ? <a className="ad-btn wa" href={wa} target="_blank" rel="noopener">💬 שליחה</a> : <span className="ad-muted">חסר טלפון</span>}
            <button className="ad-btn ok" onClick={() => markSent(g)}>✓ נשלח</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <PageHead title="אימוץ במתנה">
        <button className="ad-btn primary" onClick={() => setForm(blank())}>➕ מתנה חדשה</button>
      </PageHead>
      <Help>
        כשמגיע <b>יום השליחה</b> של מתנה, היא מופיעה למעלה. לוחצים <b>💬 שליחה</b> — נפתחת הודעת וואטסאפ מוכנה למקבל/ת המתנה עם הברכה, ואז <b>✓ נשלח</b>.
        אחרי זה המקבל/ת יופיעו אוטומטית ברשימת העדכונים החודשיים למשך שנה.
      </Help>
      {err && <p className="ad-error">{err}</p>}
      {!list ? <p>טוען…</p> : (
        <>
          <h2 className="ad-h2">לשליחה היום ({toSend.length})</h2>
          {toSend.length ? <div className="ad-list">{toSend.map(g => card(g, true))}</div> : <Empty>אין מתנות לשליחה היום ✓</Empty>}
          <h2 className="ad-h2">מתוזמנות לתאריך מאוחר יותר ({later.length})</h2>
          {later.length ? <div className="ad-list">{later.map(g => card(g, true))}</div> : <Empty>אין.</Empty>}
          {unpaid.length > 0 && (
            <details className="ad-box">
              <summary>⏳ מילאו טופס אבל התשלום עוד לא הגיע ({unpaid.length})</summary>
              <p className="ad-hint">כשהתשלום יגיע מ-Grow המתנה תעבור לבד לרשימה למעלה. אפשר לפתוח מתנה ולשנות סטטוס ידנית (למשל אם שילמו בביט), או לבטל.</p>
              <div className="ad-list">{unpaid.map(g => card(g, false))}</div>
            </details>
          )}
          {canceled.length > 0 && (
            <details className="ad-box">
              <summary>🚫 בוטלו ({canceled.length})</summary>
              <p className="ad-hint">מתנות שבוטלו לא נמחקות — הן רק מוסתרות מהרשימות. אפשר להחזיר אותן.</p>
              <div className="ad-list">{canceled.map(g => (
                <div key={g.id} className="ad-row done">
                  <div className="ad-row-main"><b>🎁 ל{g.recipient_name ?? '—'}</b><span>מאת {g.donors?.honor_name ?? '—'} · {g.dogs?.name ?? ''}</span></div>
                  <button className="ad-link" onClick={() => restore(g)}>↩ החזרה</button>
                </div>
              ))}</div>
            </details>
          )}
          {sent.length > 0 && <details className="ad-box"><summary>נשלחו ({sent.length})</summary><div className="ad-list">{sent.map(g => card(g, false))}</div></details>}
        </>
      )}
      {form && (
        <Modal title={form.id ? 'עריכת מתנה' : 'מתנה חדשה'} onClose={() => setForm(null)}>
          <form onSubmit={submit} className="ad-form">
            <h3>מי נותן/ת את המתנה</h3>
            <Field label="לכבוד (שם הקונה, לקבלה) *"><input required value={form.buyer_name} onChange={e => set('buyer_name', e.target.value)} /></Field>
            <div className="ad-grid2">
              <Field label="טלפון הקונה"><input type="tel" dir="ltr" value={form.buyer_phone} onChange={e => set('buyer_phone', e.target.value)} /></Field>
              <Field label="מייל הקונה"><input type="email" dir="ltr" value={form.buyer_email} onChange={e => set('buyer_email', e.target.value)} /></Field>
            </div>
            <h3>למי המתנה</h3>
            <div className="ad-grid2">
              <Field label="שם המקבל/ת *"><input required value={form.recipient_name} onChange={e => set('recipient_name', e.target.value)} /></Field>
              <Field label="טלפון המקבל/ת"><input type="tel" dir="ltr" value={form.recipient_phone} onChange={e => set('recipient_phone', e.target.value)} /></Field>
            </div>
            <Field label="מייל המקבל/ת"><input type="email" dir="ltr" value={form.recipient_email} onChange={e => set('recipient_email', e.target.value)} /></Field>
            <div className="ad-grid2">
              <Field label="הכלב">
                <select value={form.dog_id} onChange={e => set('dog_id', e.target.value)}>
                  <option value="">— לבחירה —</option>
                  {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="מתי לשלוח"><input type="date" value={form.send_at} onChange={e => set('send_at', e.target.value)} /></Field>
            </div>
            <Field label="הברכה האישית מהקונה"><textarea rows={3} value={form.greeting} onChange={e => set('greeting', e.target.value)} /></Field>
            <Field label="סטטוס" hint="'בוטל' מסתיר את המתנה מכל הרשימות">
              <select value={form.status} onChange={e => set('status', e.target.value as Gift['status'])}>
                {Object.entries(GIFT_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <div className="ad-form-actions">
              <button className="ad-btn primary big">שמירה</button>
              <button type="button" className="ad-btn ghost" onClick={() => setForm(null)}>ביטול</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
