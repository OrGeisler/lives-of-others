import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth'
import type { Gift, Sponsorship } from '../types'
import { Empty, Field, Help, PageHead, fail, toast } from '../ui'
import { HE_MONTHS, monthStart, waLink } from '../util'

const DEFAULT_TPL = 'היי {שם}! 🐾\nעדכון חודשי מ{כלב} — המלאך השומר שלך 😇\n\n'
const DEFAULT_GIFT_TPL = 'היי {שם}! 🎁\nעדכון חודשי מ{כלב}, הכלב שאומץ עבורך במתנה 🐾\n\n'
const load = (k: string, d: string) => { try { return localStorage.getItem(k) ?? d } catch { return d } }
const save = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } }
const fill = (tpl: string, name: string, dog: string) => tpl.replaceAll('{שם}', name).replaceAll('{כלב}', dog)

type Row = { key: string; kind: 'sponsor' | 'gift'; id: string; name: string; phone: string | null; dog: string; sent: boolean }

export default function ToSend() {
  const { session } = useAuth()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [tpl, setTpl] = useState(() => load('ad.tpl.sponsor', DEFAULT_TPL))
  const [giftTpl, setGiftTpl] = useState(() => load('ad.tpl.gift', DEFAULT_GIFT_TPL))
  const [showSent, setShowSent] = useState(false)
  const [err, setErr] = useState(false)
  const period = monthStart()

  const refresh = async () => {
    const yearAgo = new Date(); yearAgo.setFullYear(yearAgo.getFullYear() - 1)
    const [sp, gifts, logs] = await Promise.all([
      supabase.from('sponsorships').select('*, donors(*), dogs(id,slug,name,main_image)').eq('status', 'active'),
      supabase.from('gifts').select('*, dogs(id,slug,name,main_image)').not('sent_at', 'is', null).gte('sent_at', yearAgo.toISOString()).lt('sent_at', new Date(period + 'T00:00:00').toISOString()),
      supabase.from('updates_log').select('sponsorship_id,gift_id').eq('period', period),
    ])
    if ([sp, gifts, logs].some(r => r.error)) { setErr(true); setRows([]); return }
    setErr(false)
    const sentS = new Set((logs.data ?? []).map(l => l.sponsorship_id))
    const sentG = new Set((logs.data ?? []).map(l => l.gift_id))
    const r: Row[] = [
      ...((sp.data ?? []) as Sponsorship[]).map(s => ({
        key: 's' + s.id, kind: 'sponsor' as const, id: s.id, name: s.donors?.honor_name || 'ללא שם',
        phone: s.donors?.phone ?? null, dog: s.dogs?.name ?? 'הכלב', sent: sentS.has(s.id),
      })),
      ...((gifts.data ?? []) as Gift[]).map(g => ({
        key: 'g' + g.id, kind: 'gift' as const, id: g.id, name: g.recipient_name || 'ללא שם',
        phone: g.recipient_phone, dog: g.dogs?.name ?? 'הכלב', sent: sentG.has(g.id),
      })),
    ]
    setRows(r.sort((a, b) => a.dog.localeCompare(b.dog, 'he')))
  }
  useEffect(() => { refresh() }, [])

  const markSent = async (row: Row) => {
    const { error } = await supabase.from('updates_log').insert({
      [row.kind === 'sponsor' ? 'sponsorship_id' : 'gift_id']: row.id, period, channel: 'whatsapp', sent_by: session?.user.id,
    })
    if (!fail(error, 'הסימון')) { toast(`סומן: נשלח ל${row.name} ✓`); refresh() }
  }
  const undo = async (row: Row) => {
    const { error } = await supabase.from('updates_log').delete().eq('period', period).eq(row.kind === 'sponsor' ? 'sponsorship_id' : 'gift_id', row.id)
    if (!fail(error, 'הביטול')) refresh()
  }

  const pending = useMemo(() => rows?.filter(r => !r.sent) ?? [], [rows])
  const done = useMemo(() => rows?.filter(r => r.sent) ?? [], [rows])
  const byDog = useMemo(() => {
    const m = new Map<string, Row[]>()
    pending.forEach(r => m.set(r.dog, [...(m.get(r.dog) ?? []), r]))
    return [...m.entries()]
  }, [pending])

  return (
    <>
      <PageHead title={`עדכונים חודשיים — ${HE_MONTHS[new Date().getMonth()]}`} />
      <Help>
        כל מאמץ וירטואלי (וכל מי שקיבל אימוץ במתנה בשנה האחרונה) צריך לקבל <b>עדכון אחד בחודש</b> מהכלב שלו.<br />
        1. לוחצים <b>💬 וואטסאפ</b> — נפתחת שיחה עם הודעה מוכנה. מוסיפים תמונה/סרטון של הכלב ושולחים.<br />
        2. חוזרים לכאן ולוחצים <b>✓ נשלח</b> — והשורה יורדת מהרשימה.
      </Help>
      <details className="ad-box">
        <summary>✏️ עריכת נוסח ההודעה</summary>
        <Field label="הודעה למאמצים" hint="{שם} יוחלף בשם המאמץ, {כלב} בשם הכלב">
          <textarea rows={3} value={tpl} onChange={e => { setTpl(e.target.value); save('ad.tpl.sponsor', e.target.value) }} />
        </Field>
        <Field label="הודעה למקבלי מתנה">
          <textarea rows={3} value={giftTpl} onChange={e => { setGiftTpl(e.target.value); save('ad.tpl.gift', e.target.value) }} />
        </Field>
      </details>

      {err ? <p className="ad-error">לא הצלחנו לטעון את הנתונים. בדקו את החיבור לאינטרנט ונסו לרענן את העמוד.</p> : !rows ? <p>טוען…</p> : pending.length === 0 ? (
        <Empty>🎉 כל העדכונים של החודש נשלחו!{rows.length === 0 && <> עדיין אין מאמצים פעילים — <Link to="/admin/sponsors">להוספת מאמץ ←</Link></>}</Empty>
      ) : byDog.map(([dog, list]) => (
        <section key={dog} className="ad-group">
          <h2>🐶 {dog} <span className="ad-count">{list.length}</span></h2>
          {list.map(r => {
            const link = waLink(r.phone, fill(r.kind === 'gift' ? giftTpl : tpl, r.name, r.dog))
            return (
              <div key={r.key} className="ad-row">
                <div className="ad-row-main">
                  <b>{r.name}</b>{r.kind === 'gift' && <span className="ad-tag pink">מתנה</span>}
                  <span className="ad-muted" dir="ltr">{r.phone ?? 'אין טלפון'}</span>
                </div>
                <div className="ad-row-actions">
                  {link ? <a className="ad-btn wa" href={link} target="_blank" rel="noopener">💬 וואטסאפ</a> : <span className="ad-muted">חסר טלפון תקין</span>}
                  <button className="ad-btn ok" onClick={() => markSent(r)}>✓ נשלח</button>
                </div>
              </div>
            )
          })}
        </section>
      ))}

      {done.length > 0 && (
        <div className="ad-box">
          <button className="ad-link" onClick={() => setShowSent(v => !v)}>{showSent ? '▲' : '▼'} כבר נשלחו החודש ({done.length})</button>
          {showSent && done.map(r => (
            <div key={r.key} className="ad-row done">
              <div className="ad-row-main"><b>{r.name}</b> · {r.dog}</div>
              <button className="ad-link" onClick={() => undo(r)}>ביטול הסימון</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
