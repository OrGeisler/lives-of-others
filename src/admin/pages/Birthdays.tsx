import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Help, PageHead, fail, toast } from '../ui'
import { useDogsLite } from '../useDogsLite'
import { HE_MONTHS } from '../util'

type Row = { month: number; dog_id: string | null; text: string | null }

export default function Birthdays() {
  const dogs = useDogsLite()
  const [rows, setRows] = useState<Row[]>([])
  const now = new Date().getMonth() + 1

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
