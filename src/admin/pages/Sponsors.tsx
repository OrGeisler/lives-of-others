import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Modal from '../Modal'
import { SOURCES, STATUS, type Sponsorship } from '../types'
import { Empty, Field, Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { fmtDate, shekel, waLink } from '../util'

type Form = {
  sponsorship_id?: string; donor_id?: string
  honor_name: string; phone: string; email: string; source: string; consent_marketing: boolean; notes: string
  dog_id: string; tier: number; status: string; started_at: string
}
const blank = (): Form => ({
  honor_name: '', phone: '', email: '', source: '', consent_marketing: false, notes: '',
  dog_id: '', tier: 50, status: 'active', started_at: new Date().toISOString().slice(0, 10),
})

export default function Sponsors() {
  const dogs = useDogsLite()
  const [params, setParams] = useSearchParams()
  const [list, setList] = useState<Sponsorship[] | null>(null)
  const [q, setQ] = useState('')
  const [form, setForm] = useState<Form | null>(null)
  const status = params.get('status') ?? 'active'
  const dogF = params.get('dog') ?? ''

  const refresh = async () => {
    const { data } = await supabase.from('sponsorships').select('*, donors(*), dogs(id,slug,name,main_image)').order('created_at', { ascending: false })
    setList((data ?? []) as Sponsorship[])
  }
  useEffect(() => { refresh() }, [])

  const shown = useMemo(() => (list ?? []).filter(s =>
    (status === 'all' || s.status === status) && (!dogF || s.dog_id === dogF) &&
    (!q || [s.donors?.honor_name, s.donors?.phone, s.donors?.email, s.dogs?.name].some(v => v?.toLowerCase().includes(q.toLowerCase())))
  ), [list, status, dogF, q])

  const setParam = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p) }

  const edit = (s: Sponsorship) => setForm({
    sponsorship_id: s.id, donor_id: s.donor_id,
    honor_name: s.donors?.honor_name ?? '', phone: s.donors?.phone ?? '', email: s.donors?.email ?? '',
    source: s.donors?.source ?? '', consent_marketing: s.donors?.consent_marketing ?? false, notes: s.donors?.notes ?? '',
    dog_id: s.dog_id ?? '', tier: s.tier ?? 50, status: s.status, started_at: (s.started_at ?? s.created_at).slice(0, 10),
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    const donor = {
      honor_name: form.honor_name.trim(), phone: form.phone.trim() || null, email: form.email.trim() || null,
      source: form.source || null, consent_marketing: form.consent_marketing, notes: form.notes.trim() || null,
    }
    let donorId = form.donor_id
    if (donorId) {
      if (fail((await supabase.from('donors').update(donor).eq('id', donorId)).error, 'השמירה')) return
    } else {
      const r = await supabase.from('donors').insert(donor).select('id').single()
      if (fail(r.error, 'השמירה')) return
      donorId = r.data!.id
    }
    const sp = {
      donor_id: donorId, dog_id: form.dog_id || null, tier: form.tier, status: form.status,
      started_at: form.started_at || null, canceled_at: form.status === 'canceled' ? new Date().toISOString() : null,
    }
    const r = form.sponsorship_id
      ? await supabase.from('sponsorships').update(sp).eq('id', form.sponsorship_id)
      : await supabase.from('sponsorships').insert(sp)
    if (fail(r.error, 'השמירה')) return
    toast('נשמר ✓'); setForm(null); refresh()
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(f => f && { ...f, [k]: v })

  return (
    <>
      <PageHead title="מאמצים וירטואליים">
        <button className="ad-btn primary" onClick={() => setForm(blank())}>➕ מאמץ חדש</button>
      </PageHead>
      <Help>
        כאן רואים את כל מי שמאמץ כלב וירטואלית. כשמגיע תשלום מ-Grow הוא יופיע אוטומטית (ממתין לחיבור ל-Grow).
        בינתיים — אפשר להוסיף מאמצים ידנית בכפתור <b>➕ מאמץ חדש</b>. לחיצה על שורה פותחת עריכה.
      </Help>
      <div className="ad-filters">
        <input type="search" placeholder="🔍 חיפוש לפי שם, טלפון, מייל או כלב" value={q} onChange={e => setQ(e.target.value)} />
        <select value={status} onChange={e => setParam('status', e.target.value)} aria-label="סטטוס">
          <option value="active">פעילים</option><option value="pending">ממתינים</option>
          <option value="failed">חיוב נכשל</option><option value="canceled">בוטלו</option><option value="all">הכל</option>
        </select>
        <select value={dogF} onChange={e => setParam('dog', e.target.value)} aria-label="כלב">
          <option value="">כל הכלבים</option>
          {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {!list ? <p>טוען…</p> : shown.length === 0 ? <Empty>אין מאמצים להצגה כאן.</Empty> : (
        <div className="ad-list">
          {shown.map(s => {
            const wa = waLink(s.donors?.phone, `היי ${s.donors?.honor_name ?? ''}! 🐾`)
            return (
              <div key={s.id} className="ad-row clickable" onClick={() => edit(s)}>
                {s.dogs?.main_image && <img className="ad-thumb" src={s.dogs.main_image} alt="" />}
                <div className="ad-row-main">
                  <b>{s.donors?.honor_name || 'ללא שם'}</b>
                  <span>{s.dogs?.name ?? 'ללא כלב'} · {shekel(s.tier)} לחודש · מאז {fmtDate(s.started_at)}</span>
                  <span className="ad-muted" dir="ltr">{[s.donors?.phone, s.donors?.email].filter(Boolean).join(' · ')}</span>
                </div>
                <span className={`ad-tag st-${s.status}`}>{STATUS[s.status]}</span>
                {wa && <a className="ad-btn wa sm" href={wa} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} aria-label="וואטסאפ">💬</a>}
              </div>
            )
          })}
        </div>
      )}

      {form && (
        <Modal title={form.sponsorship_id ? 'עריכת מאמץ' : 'מאמץ חדש'} onClose={() => setForm(null)}>
          <form onSubmit={submit} className="ad-form">
            <Field label="לכבוד (השם לקבלה) *"><input required value={form.honor_name} onChange={e => set('honor_name', e.target.value)} /></Field>
            <div className="ad-grid2">
              <Field label="טלפון" hint="לשליחת עדכונים בוואטסאפ"><input type="tel" dir="ltr" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="050-0000000" /></Field>
              <Field label="מייל"><input type="email" dir="ltr" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
            </div>
            <div className="ad-grid2">
              <Field label="הכלב שאומץ">
                <select value={form.dog_id} onChange={e => set('dog_id', e.target.value)}>
                  <option value="">— לבחירה —</option>
                  {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="סכום חודשי">
                <select value={form.tier} onChange={e => set('tier', Number(e.target.value))}>
                  <option value={25}>25 ₪</option><option value={50}>50 ₪</option><option value={100}>100 ₪</option>
                </select>
              </Field>
            </div>
            <div className="ad-grid2">
              <Field label="סטטוס">
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </Field>
              <Field label="תאריך התחלה"><input type="date" value={form.started_at} onChange={e => set('started_at', e.target.value)} /></Field>
            </div>
            <Field label="איך הגיע/ה אלינו">
              <select value={form.source} onChange={e => set('source', e.target.value)}>
                <option value="">—</option>
                {Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <label className="ad-check"><input type="checkbox" checked={form.consent_marketing} onChange={e => set('consent_marketing', e.target.checked)} /> מסכים/ה לקבל עדכונים ודיוור</label>
            <Field label="הערות"><textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} /></Field>
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
