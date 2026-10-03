import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Counter, Fallen, TeamMember } from '../../lib/types'
import { uploadImage } from '../image'
import AskText from '../AskText'
import { Field, Help, PageHead, fail, toast } from '../ui'

type Member = TeamMember & { active: boolean }

export default function SiteContent() {
  const [counters, setCounters] = useState<Counter[]>([])
  const [team, setTeam] = useState<Member[]>([])
  const [fallen, setFallen] = useState<Fallen[]>([])
  const [asking, setAsking] = useState(false)

  const refresh = async () => {
    const [c, t, f] = await Promise.all([
      supabase.from('site_settings').select('value').eq('key', 'counters').maybeSingle(),
      supabase.from('team').select('*').order('sort'),
      supabase.from('fallen').select('*').order('sort'),
    ])
    setCounters((c.data?.value as Counter[]) ?? [])
    setTeam((t.data ?? []) as Member[])
    setFallen((f.data ?? []) as Fallen[])
  }
  useEffect(() => { refresh() }, [])

  const saveCounters = async () => {
    if (!fail((await supabase.from('site_settings').upsert({ key: 'counters', value: counters })).error, 'השמירה')) toast('המספרים עודכנו ✓')
  }
  const updMember = (id: string, patch: Partial<Member>) => setTeam(ts => ts.map(m => (m.id === id ? { ...m, ...patch } : m)))
  const saveMember = async (m: Member) => {
    if (!fail((await supabase.from('team').update({ name: m.name, photo: m.photo, active: m.active }).eq('id', m.id)).error, 'השמירה')) toast(`${m.name} נשמר/ה ✓`)
  }
  const addMember = async (name: string) => {
    const sort = (team.at(-1)?.sort ?? 0) + 1
    if (!fail((await supabase.from('team').insert({ name, sort })).error, 'ההוספה')) { toast('נוסף/ה — עכשיו אפשר להעלות תמונה'); setAsking(false); refresh() }
  }
  const photo = async (m: Member, file: File | undefined) => {
    if (!file) return
    try {
      const url = await uploadImage(file, 'team')
      updMember(m.id, { photo: url })
      if (!fail((await supabase.from('team').update({ photo: url }).eq('id', m.id)).error, 'השמירה')) toast('התמונה עודכנה ✓')
    } catch (e) { toast(`העלאה נכשלה: ${(e as Error).message}`, true) }
  }
  const updFallen = (id: string, patch: Partial<Fallen>) => setFallen(fs => fs.map(f => (f.id === id ? { ...f, ...patch } : f)))
  const saveFallen = async (f: Fallen) => {
    if (!fail((await supabase.from('fallen').update({ card_text: f.card_text, grow_link: f.grow_link }).eq('id', f.id)).error, 'השמירה')) toast('נשמר ✓')
  }

  return (
    <>
      <PageHead title="תוכן האתר" />
      <Help>כאן מעדכנים חלקים קבועים באתר: המספרים בראש העמוד, הצוות, ודפי ההנצחה. כל שינוי נשמר בכפתור השמירה שלו.</Help>

      <section className="ad-box">
        <h2 className="ad-h2">📊 המספרים בעמוד הראשי</h2>
        {counters.map((c, i) => (
          <div key={i} className="ad-grid3">
            <Field label="מספר"><input type="number" value={c.value} onChange={e => setCounters(cs => cs.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)))} /></Field>
            <Field label="תוספת" hint='למשל " ₪"'><input value={c.suffix} onChange={e => setCounters(cs => cs.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))} /></Field>
            <Field label="כיתוב"><input value={c.label} onChange={e => setCounters(cs => cs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} /></Field>
          </div>
        ))}
        <button className="ad-btn primary" onClick={saveCounters}>שמירת המספרים</button>
      </section>

      <section className="ad-box">
        <div className="ad-head"><h2 className="ad-h2">👥 הצוות שלנו</h2><button className="ad-btn" onClick={() => setAsking(true)}>➕ הוספה</button></div>
        <div className="ad-team">
          {team.map(m => (
            <div key={m.id} className={`ad-member${m.active ? '' : ' hidden'}`}>
              <label className="ad-member-photo" title="החלפת תמונה">
                {m.photo ? <img src={m.photo} alt="" /> : <span>📷</span>}
                <input type="file" accept="image/*" onChange={e => photo(m, e.target.files?.[0])} />
              </label>
              <input value={m.name} onChange={e => updMember(m.id, { name: e.target.value })} aria-label="שם" />
              <label className="ad-check"><input type="checkbox" checked={m.active} onChange={e => updMember(m.id, { active: e.target.checked })} /> מוצג</label>
              <button className="ad-btn sm primary" onClick={() => saveMember(m)}>שמירה</button>
            </div>
          ))}
        </div>
        <p className="ad-hint">לחיצה על התמונה מחליפה אותה.</p>
      </section>

      <section className="ad-box">
        <h2 className="ad-h2">🕯️ פרויקטי ההנצחה</h2>
        {fallen.map(f => (
          <div key={f.id} className="ad-fallen">
            <b>{f.card_title}</b>
            <Field label="משפט בכרטיס"><input value={f.card_text ?? ''} onChange={e => updFallen(f.id, { card_text: e.target.value })} /></Field>
            <Field label="קישור לדף התרומה ב-Grow"><input dir="ltr" value={f.grow_link ?? ''} onChange={e => updFallen(f.id, { grow_link: e.target.value })} /></Field>
            <button className="ad-btn sm primary" onClick={() => saveFallen(f)}>שמירה</button>
          </div>
        ))}
        <p className="ad-hint">שינוי בסיפור המלא של פרויקט הנצחה — דרך אור (כדי לשמור על העיצוב).</p>
      </section>
      {asking && <AskText title="איש/אשת צוות חדש/ה" label="שם" okLabel="הוספה" onOk={addMember} onClose={() => setAsking(false)} />}
    </>
  )
}
