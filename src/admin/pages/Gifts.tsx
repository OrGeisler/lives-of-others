import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import type { Gift } from '../types'
import { Empty, Field, Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { sendCertificate } from '../certificate'
import { fmtDate } from '../util'
import WaShare, { SITE, certUrl } from '../WaShare'
import { localDate } from '../../lib/constants'

const GIFT_STATUS: Record<Gift['status'], string> = { pending: 'ממתין לתשלום', paid: 'שולם', sent: 'נשלח', canceled: 'בוטל' }

type Form = {
  id?: string; buyer_donor_id?: string | null; status: Gift['status']; sent_at?: string | null
  buyer_name: string; buyer_phone: string; buyer_email: string
  dog_id: string; recipient_name: string; recipient_phone: string; recipient_email: string; greeting: string; send_at: string
}
const blank = (): Form => ({
  status: 'paid', buyer_name: '', buyer_phone: '', buyer_email: '', dog_id: '', recipient_name: '', recipient_phone: '',
  recipient_email: '', greeting: '', send_at: localDate(),
})

// 13.10: the nonprofit's own wording, in the dog's voice
const giftMessage = (g: Gift) => {
  const dog = g.dogs?.name ?? 'הכלב'
  return [
    `היי ${g.recipient_name ?? ''},`,
    `כאן ${dog}, אני ושאר הכלבים ממש נרגשים ש${g.donors?.honor_name ?? 'מישהו שאוהב אותך'} העניק/ה לך מתנה מיוחדת – אימוץ וירטואלי מעמותת "חיים של אחרים" 🐾`,
    'אנחנו תמיד שמחים לצרף חברים חדשים ללהקה ❤️',
    'מרגע זה הפכת להיות "המלאך השומר שלי", ואני אדאג לספר לך מדי פעם על החוויות שלי ושל שאר החברים.',
    ...(g.greeting ? ['', `"${g.greeting}"`, ''] : []),
    'תודה מכל הלב על התמיכה בי — בזכותך אני והחברים שאיתי מטופלים, מוגנים ואהובים.',
    '',
    // 9.11 (Or): link to this dog's own page, not the general virtual-adoption page
    `רוצה להכיר אותי טוב יותר? ${g.dogs?.slug ? `${SITE}/dogs/${g.dogs.slug}` : `${SITE}/virtual-adoption`}`,
  ].join('\n')
}

const giftWithCert = (g: Gift) =>
  `${giftMessage(g)}\n\nתעודת האימוץ שלך${g.dogs?.thanks_video_url ? ` וסרטון תודה מ${g.dogs.name} 🎬` : ''}:\n${certUrl(g.id)}`

export default function Gifts() {
  const dogs = useDogsLite()
  const [list, setList] = useState<Gift[] | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [err, setErr] = useState('')

  const refresh = async () => {
    const { data, error } = await supabase.from('gifts').select('*, donors(*), dogs(id,slug,name,main_image,thanks_video_url)').order('send_at')
    setErr(error ? 'לא הצלחנו לטעון את המתנות. בדקו את החיבור לאינטרנט ונסו לרענן.' : '')
    setList((data ?? []) as Gift[])
  }
  useEffect(() => { refresh() }, [])

  const today = new Date(); today.setHours(23, 59, 59, 999)
  const toSend = useMemo(() => (list ?? []).filter(g => g.status === 'paid' && !g.sent_at && g.send_at && new Date(g.send_at) <= today), [list])
  const later = useMemo(() => (list ?? []).filter(g => g.status === 'paid' && !g.sent_at && (!g.send_at || new Date(g.send_at) > today)), [list])
  const unpaid = useMemo(() => (list ?? []).filter(g => g.status === 'pending'), [list])
  const canceled = useMemo(() => (list ?? []).filter(g => g.status === 'canceled'), [list])
  const sent = useMemo(() => (list ?? []).filter(g => g.sent_at && g.status !== 'canceled'), [list])
  // 9.11: paid gifts whose buyer never got the certificate email (the dashboard tile links here)
  const buyerMail = useMemo(() => (list ?? []).filter(g => (g.status === 'paid' || g.status === 'sent') && !g.certificate_sent_at), [list])
  type Tab = 'today' | 'later' | 'pending' | 'sent' | 'canceled' | 'all' | 'buyer'
  const TABS: { k: Tab; label: string }[] = [
    { k: 'today', label: 'לשליחה היום' }, { k: 'later', label: 'מתוזמנות' }, { k: 'pending', label: 'ממתינות לתשלום' },
    { k: 'sent', label: 'נשלחו' }, { k: 'canceled', label: 'בוטלו' }, { k: 'all', label: 'הכל' },
    ...(buyerMail.length ? [{ k: 'buyer' as Tab, label: '📧 קונה בלי מייל' }] : []),
  ]
  // ?tab=buyer from the dashboard tile
  const [tab, setTab] = useState<Tab>(() => (new URLSearchParams(location.search).get('tab') as Tab) || 'today')
  const [q, setQ] = useState('')
  const byTab: Record<Tab, Gift[]> = { today: toSend, later, pending: unpaid, sent, canceled, all: list ?? [], buyer: buyerMail }
  const counts = Object.fromEntries((Object.keys(byTab) as Tab[]).map(k => [k, byTab[k].length])) as Record<Tab, number>
  const shown = byTab[tab].filter(g => !q || [g.recipient_name, g.recipient_phone, g.donors?.honor_name, g.donors?.phone, g.dogs?.name]
    .some(v => v?.toLowerCase().includes(q.toLowerCase())))
  const restore = async (g: Gift) => {
    if (!fail((await supabase.from('gifts').update({ status: g.sent_at ? 'sent' : 'paid' }).eq('id', g.id)).error, 'השחזור')) { toast('המתנה שוחזרה ✓'); refresh() }
  }

  const [busy, setBusy] = useState('')
  const [handled] = useState(() => new Set<string>())

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
      // a gift sent outside the system: status "נשלח" here also stamps sent_at (the monthly updates and the "נשלחו" tab
      // go by sent_at); setting it back to "שולם"/"ממתין" clears it (undo a send marked by mistake)
      ...(form.status === 'sent' && !form.sent_at ? { sent_at: new Date().toISOString() } : {}),
      ...((form.status === 'paid' || form.status === 'pending') && form.sent_at ? { sent_at: null } : {}),
    }
    const r = form.id ? await supabase.from('gifts').update(gift).eq('id', form.id) : await supabase.from('gifts').insert(gift)
    if (!fail(r.error, 'השמירה')) { if (form.id) handled.delete(form.id); toast('נשמר ✓'); setForm(null); refresh() }
  }
  const edit = (g: Gift) => setForm({
    id: g.id, status: g.status, sent_at: g.sent_at, buyer_donor_id: g.buyer_donor_id, buyer_name: g.donors?.honor_name ?? '', buyer_phone: g.donors?.phone ?? '',
    buyer_email: g.donors?.email ?? '', dog_id: g.dog_id ?? '', recipient_name: g.recipient_name ?? '',
    recipient_phone: g.recipient_phone ?? '', recipient_email: g.recipient_email ?? '', greeting: g.greeting ?? '',
    send_at: g.send_at ? localDate(new Date(g.send_at)) : '',
  })
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => f && { ...f, [k]: v })

  const done = (e: string | null, ok: string) => { if (e) toast(e, true); else toast(ok); refresh() }
  const stamp = (g: Gift, fields: Record<string, string>) => supabase.from('gifts').update(fields).eq('id', g.id).then(r => r.error)
  // 9.11 (Or): two separate buttons for the recipient, WhatsApp and email, so staff send both themselves at the same time
  // (there is no automatic recipient email). Opening the WhatsApp marks the gift as sent (monthly updates start).
  const markWa = async (g: Gift) => {
    if (handled.has(g.id) || g.sent_at) return // the window calls this again for each shared file
    handled.add(g.id)
    const dbErr = await stamp(g, { sent_at: new Date().toISOString(), status: 'sent' })
    if (fail(dbErr, 'הסימון כנשלח')) { handled.delete(g.id); return }
    toast('המתנה סומנה כנשלחה ✓')
    refresh()
  }
  // the recipient email: always asks first (and says if it was already sent)
  const emailRecipient = async (g: Gift) => {
    const again = g.recipient_certificate_sent_at ? ` (כבר נשלח ב-${fmtDate(g.recipient_certificate_sent_at)})` : ''
    if (!confirm(`לשלוח ל${g.recipient_name ?? 'מקבל/ת המתנה'} את המייל עם הברכה והתעודה (${g.recipient_email})${again}?`)) return
    setBusy(g.id + 'r')
    const e = await sendCertificate(g.id, 'recipient')
    if (!e && !g.sent_at) fail(await stamp(g, { sent_at: new Date().toISOString(), status: 'sent' }), 'הסימון כנשלח')
    setBusy('')
    done(e, `המייל נשלח ל${g.recipient_name ?? 'מקבל/ת המתנה'} ✓`)
  }
  const emailBuyer = async (g: Gift) => {
    if (g.certificate_sent_at && !confirm(`הקונה כבר קיבל/ה מייל ב-${fmtDate(g.certificate_sent_at)}. לשלוח שוב?`)) return
    setBusy(g.id + 'b')
    const e = await sendCertificate(g.id)
    setBusy('')
    done(e, 'המייל עם התעודה נשלח לקונה ✓')
  }

  const card = (g: Gift) => {
    const paid = g.status === 'paid' || g.status === 'sent'
    const phone = !!g.recipient_phone
    const wa = (label: string, cls: string, onSent?: () => void) => (
      <WaShare phone={g.recipient_phone} to={g.recipient_name ?? 'מקבל/ת המתנה'} dog={g.dogs?.name} certId={g.id} video={g.dogs?.thanks_video_url}
        text={giftWithCert(g)} label={label} className={cls} onSent={onSent} />
    )
    return (
      <div key={g.id} className="ad-row clickable" role="button" tabIndex={0} onClick={() => edit(g)} onKeyDown={e => { if (e.key === 'Enter') edit(g) }}>
        {g.dogs?.main_image && <img className="ad-thumb" src={g.dogs.main_image} alt="" />}
        <div className="ad-row-main">
          <b>🎁 ל{g.recipient_name ?? '—'}</b>
          <span>מאת {g.donors?.honor_name ?? '—'} · {g.dogs?.name ?? 'ללא כלב'} · {g.sent_at ? `נשלח ${fmtDate(g.sent_at)}` : `לשליחה ב-${fmtDate(g.send_at)}`}</span>
          {g.greeting && <span className="ad-muted">"{g.greeting}"</span>}
          {paid && <a className="ad-link ad-gift-cert" href={`/certificate/${g.id}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>📜 צפייה בתעודה</a>}
        </div>
        {paid && (
          <div className="ad-gift-groups" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
            <div className="ad-gift-group">
              <h4>למקבל/ת המתנה</h4>
              {!phone && !g.recipient_email ? <span className="ad-muted">חסר טלפון ומייל של המקבל/ת — לוחצים על המתנה ומוסיפים</span> : (
                <>
                  <div className="ad-row-actions">
                    {phone
                      ? wa(g.sent_at ? '💬 וואטסאפ שוב' : '💬 שליחה בוואטסאפ', g.sent_at ? 'ad-btn sm' : 'ad-btn wa', () => markWa(g))
                      : <span className="ad-muted">אין טלפון</span>}
                    {g.recipient_email
                      ? <button type="button" className="ad-btn sm" disabled={busy === g.id + 'r'} onClick={() => emailRecipient(g)}>
                          {busy === g.id + 'r' ? '⏳ שולח…' : g.recipient_certificate_sent_at ? '📧 מייל שוב' : '📧 שליחה במייל'}
                        </button>
                      : <span className="ad-muted">אין מייל</span>}
                  </div>
                  <span className="ad-muted">
                    {g.sent_at ? `✓ נשלח ${fmtDate(g.sent_at)}` : phone && g.recipient_email ? 'שולחים את שניהם יחד: וואטסאפ ומייל' : ''}
                    {g.recipient_certificate_sent_at ? ` · מייל: ${fmtDate(g.recipient_certificate_sent_at)}` : ''}
                  </span>
                </>
              )}
            </div>
            <div className="ad-gift-group">
              <h4>לקונה</h4>
              {g.certificate_sent_at ? (
                <div className="ad-row-actions">
                  <span>📧 קיבל/ה מייל {fmtDate(g.certificate_sent_at)}</span>
                  <button type="button" className="ad-link" disabled={busy === g.id + 'b'} onClick={() => emailBuyer(g)}>שליחה שוב</button>
                </div>
              ) : g.donors?.email ? (
                <button type="button" className="ad-btn sm" disabled={busy === g.id + 'b'} onClick={() => emailBuyer(g)}>
                  {busy === g.id + 'b' ? '⏳ שולח…' : '📧 שליחת מייל לקונה'}
                </button>
              ) : <span className="ad-muted">לקונה אין מייל</span>}
            </div>
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
        בכל מתנה יש שני חלקים: <b>למקבל/ת המתנה</b> ו<b>לקונה</b>.
        כשמגיע <b>יום השליחה</b>, המתנה מופיעה ב"לשליחה היום". למקבל/ת שולחים <b>את שניהם יחד</b>: <b>💬 שליחה בוואטסאפ</b> (הודעה מוכנה מהכלב עם הברכה, וקישור לתעודה ולסרטון) ו<b>📧 שליחה במייל</b>.
        פתיחת הוואטסאפ מסמנת את המתנה כ<b>נשלחה</b>, והמקבל/ת נכנס/ת לעדכונים החודשיים למשך שנה. אין מייל אוטומטי למקבל/ת.
        <b>הקונה</b> מקבל/ת מייל עם התעודה לבד מיד אחרי התשלום; רואים את זה בשורה "📧 קיבל/ה מייל".
        מתנה שנשלחה בדרך אחרת? לוחצים עליה ומשנים סטטוס ל"נשלח".
      </Help>
      {err && <p className="ad-error">{err}</p>}
      <div className="ad-tabs" role="tablist">
        {TABS.map(t => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} className={`ad-tab${tab === t.k ? ' on' : ''}`} onClick={() => setTab(t.k)}>
            {t.label} <span className="ad-tab-n">{counts[t.k]}</span>
          </button>
        ))}
      </div>
      <div className="ad-filters"><input type="search" placeholder="🔍 חיפוש לפי שם, טלפון או כלב" value={q} onChange={e => setQ(e.target.value)} /></div>
      {tab === 'buyer' && <p className="ad-hint">כאן מתנות ששולמו, אבל הקונה לא קיבל/ה את המייל עם התעודה. בכל מתנה, בחלק <b>לקונה</b>, לוחצים <b>📧 שליחת מייל לקונה</b>. אחרי השליחה המתנה יוצאת מהרשימה.</p>}
      {tab === 'pending' && <p className="ad-hint">מילאו טופס אבל התשלום עוד לא הגיע. כשהתשלום יגיע מ-Grow המתנה תעבור לבד ל"לשליחה". שילמו בביט/מזומן? פותחים את המתנה ומשנים סטטוס ל"שולם".</p>}
      {tab === 'canceled' && <p className="ad-hint">מתנות שבוטלו לא נמחקות — אפשר להחזיר אותן.</p>}
      {!list ? <p>טוען…</p> : shown.length === 0 ? <Empty>{tab === 'today' ? 'אין מתנות לשליחה היום ✓' : 'אין מתנות כאן.'}</Empty> : (
        <div className="ad-list">{shown.map(g => g.status === 'canceled'
          ? (
            <div key={g.id} className="ad-row done clickable" role="button" tabIndex={0} onClick={() => edit(g)}>
              <div className="ad-row-main"><b>🎁 ל{g.recipient_name ?? '—'}</b><span>מאת {g.donors?.honor_name ?? '—'} · {g.dogs?.name ?? ''} · נוצרה {fmtDate(g.created_at)}</span></div>
              <span className="ad-tag st-canceled">בוטל</span>
              <button className="ad-link" onClick={e => { e.stopPropagation(); restore(g) }}>↩ החזרה</button>
            </div>
          )
          : card(g))}</div>
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
