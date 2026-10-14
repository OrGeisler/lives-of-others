import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Empty, Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { HE_MONTHS, fmtDate, shekel } from '../util'
import WaShare, { SITE } from '../WaShare'

type Row = { month: number; dog_id: string | null; text: string | null }
type BdPay = { id: string; payer_name: string | null; payer_phone: string | null; sum: number | null; paid_at: string | null; created_at: string; thanks_sent_at: string | null; source_link: string | null }

const monthOf = (p: BdPay) => new Date(p.paid_at ?? p.created_at).getMonth() + 1
const thanksText = (name: string, dog: string, link: string) =>
  `היי ${name}! 🎂\nתודה על המתנה ליום ההולדת של ${dog}! בזכותך זה היה יום שמח במיוחד, עם הרבה כשכושי זנב 🐕💛\n\nהכנו לך איגרת תודה קטנה:\n${link}\n\nבאהבה, ${dog} וכל המשפחה של עמותת חיים של אחרים 🐾`

export default function Birthdays() {
  const dogs = useDogsLite()
  const [rows, setRows] = useState<Row[]>([])
  const now = new Date().getMonth() + 1
  const [pays, setPays] = useState<BdPay[] | null>(null)
  const loadPays = () => {
    const since = new Date(Date.now() - 90 * 864e5).toISOString()
    supabase.from('payments').select('id,payer_name,payer_phone,sum,paid_at,created_at,thanks_sent_at,source_link').eq('kind', 'birthday').gte('created_at', since)
      .order('created_at', { ascending: false }).then(({ data }) => setPays((data ?? []) as BdPay[]))
  }
  useEffect(loadPays, [])
  const markThanks = async (p: BdPay) => {
    if (p.thanks_sent_at) return
    if (!fail((await supabase.from('payments').update({ thanks_sent_at: new Date().toISOString() }).eq('id', p.id)).error, 'הסימון')) loadPays()
  }

  useEffect(() => {
    supabase.from('birthday_schedule').select('month,dog_id,text').then(({ data }) => {
      const m = new Map((data ?? []).map(r => [r.month, r]))
      setRows(Array.from({ length: 12 }, (_, i) => m.get(i + 1) ?? { month: i + 1, dog_id: null, text: null }))
    })
  }, [])

  const save = async (r: Row) => {
    if (!fail((await supabase.from('birthday_schedule').upsert(r)).error, 'השמירה')) toast(`${HE_MONTHS[r.month - 1]} נשמר ✓`)
  }
  const upd = (month: number, patch: Partial<Row>) => setRows(rs => rs.map(r => (r.month === month ? { ...r, ...patch } : r)))

  return (
    <>
      <PageHead title="יום הולדת לכלב 🎂" />
      <Help>
        בוחרים כלב לכל חודש — והאתר מחליף <b>אוטומטית</b> את כלב יום ההולדת בתחילת כל חודש (בעמוד הראשי ובעמוד יום ההולדת).
        אפשר גם לכתוב טקסט קצר לכל כלב. אחרי שינוי לוחצים <b>שמירה</b> באותה שורה.
      </Help>
      <h2 className="ad-h2">🎁 מתנות יום הולדת: לשלוח תודה</h2>
      <p className="ad-hint">כל מי ששילם בדף יום ההולדת ב-90 הימים האחרונים. 💬 פותח הודעת תודה מוכנה עם איגרת התודה של כלב החודש.</p>
      {!pays ? <p>טוען…</p> : pays.length === 0 ? <Empty>עדיין אין מתנות יום הולדת.</Empty> : (
        <div className="ad-list">
          {pays.map(p => {
            const m = monthOf(p)
            const dog = dogs.find(d => d.id === rows.find(r => r.month === m)?.dog_id)
            const first = (p.payer_name ?? '').trim().split(/\s+/)[0] ?? ''
            const link = `${SITE}/birthday-thanks?${new URLSearchParams({ name: first, month: String(m), ...(dog ? { dog: dog.slug } : {}) })}`
            return (
              <div key={p.id} className="ad-row">
                {dog?.main_image && <img className="ad-thumb" src={dog.main_image} alt="" />}
                <div className="ad-row-main">
                  <b>{p.payer_name ?? '—'} · {shekel(p.sum)}</b>
                  <span>{p.source_link === 'TEST' && <span className="ad-tag gray">🧪 בדיקה</span>}ליום ההולדת של {dog?.name ?? `כלב ${HE_MONTHS[m - 1]}`} · {fmtDate(p.paid_at ?? p.created_at)}</span>
                  <span className="ad-muted" dir="ltr">{p.payer_phone}</span>
                </div>
                {p.thanks_sent_at ? <span className="ad-tag st-active">תודה נשלחה ✓</span> : <span className="ad-tag gold">עוד לא הודינו</span>}
                <WaShare phone={p.payer_phone} to={p.payer_name ?? ''} dog={dog?.name} video={dog?.thanks_video_url}
                  text={thanksText(first, dog?.name ?? 'הכלב', link)} label="💬 תודה" sent={!!p.thanks_sent_at} onSent={() => markThanks(p)} />
              </div>
            )
          })}
        </div>
      )}

      <h2 className="ad-h2">📅 כלב לכל חודש</h2>
      <div className="ad-list">
        {rows.map(r => (
          <div key={r.month} className={`ad-bday${r.month === now ? ' now' : ''}`}>
            <div className="ad-bday-month">{HE_MONTHS[r.month - 1]}{r.month === now && <span className="ad-tag pink">החודש</span>}</div>
            <select value={r.dog_id ?? ''} onChange={e => upd(r.month, { dog_id: e.target.value || null })} aria-label={`כלב ל${HE_MONTHS[r.month - 1]}`}>
              <option value="">— לא נבחר —</option>
              {dogs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <textarea rows={2} placeholder="טקסט קצר על הכלב לחודש הזה (לא חובה)" value={r.text ?? ''} onChange={e => upd(r.month, { text: e.target.value || null })} />
            <button className="ad-btn primary" onClick={() => save(r)}>שמירה</button>
          </div>
        ))}
      </div>
    </>
  )
}
