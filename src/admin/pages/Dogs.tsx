import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Dog } from '../../lib/types'
import AskText from '../AskText'
import { Help, PageHead, fail, toast } from '../ui'

type Row = Dog & { active: boolean }

export default function Dogs() {
  const nav = useNavigate()
  const [dogs, setDogs] = useState<Row[] | null>(null)
  const [asking, setAsking] = useState(false)
  const refresh = () => supabase.from('dogs').select('*').order('sort').then(({ data }) => setDogs((data ?? []) as Row[]))
  useEffect(() => { refresh() }, [])

  const add = async (name: string) => {
    const sort = (dogs?.at(-1)?.sort ?? 0) + 1
    const r = await supabase.from('dogs').insert({ name, slug: `dog-${Date.now()}`, sort, active: false }).select('id').single()
    if (!fail(r.error, 'ההוספה')) nav(`/admin/dogs/${r.data!.id}`)
  }

  const move = async (i: number, d: -1 | 1) => {
    if (!dogs) return
    const a = dogs[i], b = dogs[i + d]
    if (!b) return
    const r1 = await supabase.from('dogs').update({ sort: b.sort }).eq('id', a.id)
    const r2 = await supabase.from('dogs').update({ sort: a.sort }).eq('id', b.id)
    if (!fail(r1.error ?? r2.error, 'שינוי הסדר')) { toast('הסדר עודכן ✓'); refresh() }
  }

  return (
    <>
      <PageHead title="הכלבים שלנו"><button className="ad-btn primary" onClick={() => setAsking(true)}>➕ כלב חדש</button></PageHead>
      <Help>
        לחיצה על כלב פותחת עריכה: שם, גיל, סיפור ותמונות. החיצים ▲▼ קובעים את <b>הסדר באתר</b>.
        כלב חדש נוצר <b>מוסתר</b> — כשהוא מוכן מסמנים "מוצג באתר".
      </Help>
      {!dogs ? <p>טוען…</p> : (
        <div className="ad-dogs">
          {dogs.map((d, i) => (
            <div key={d.id} className={`ad-dog${d.active ? '' : ' hidden'}`}>
              <button className="ad-dog-open" onClick={() => nav(`/admin/dogs/${d.id}`)}>
                {d.main_image ? <img src={d.main_image} alt="" /> : <div className="ad-noimg">📷</div>}
                <b>{d.name}</b>
                <span className="ad-muted">{d.age_text ?? ''}</span>
                <span className="ad-tags">
                  {!d.active && <span className="ad-tag gray">מוסתר</span>}
                  {d.available_for_adoption && <span className="ad-tag">לאימוץ</span>}
                  {d.available_for_virtual && <span className="ad-tag pink">וירטואלי</span>}
                  {d.available_for_gift && <span className="ad-tag gold">מתנה</span>}
                </span>
              </button>
              <div className="ad-dog-order">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="הזזה למעלה">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === dogs.length - 1} aria-label="הזזה למטה">▼</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {asking && <AskText title="כלב חדש 🐶" label="איך קוראים לכלב?" hint="אחרי זה תגיעו למסך שבו מוסיפים גיל, סיפור ותמונות" okLabel="המשך ←" onOk={add} onClose={() => setAsking(false)} />}
    </>
  )
}
