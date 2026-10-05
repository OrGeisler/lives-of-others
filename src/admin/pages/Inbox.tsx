import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Empty, Help, PageHead, fail, toast } from '../ui'
import { fmtDate, waLink } from '../util'

type Msg = { id: string; name: string; phone: string | null; topic: string | null; message: string | null; handled_at: string | null; created_at: string }

// Contact-form inquiries from the site (/contact)
export default function Inbox() {
  const [list, setList] = useState<Msg[] | null>(null)
  const [tab, setTab] = useState<'open' | 'done'>('open')
  const refresh = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(300)
    setList((data ?? []) as Msg[])
  }
  useEffect(() => { refresh() }, [])
  const mark = async (m: Msg, done: boolean) => {
    if (!fail((await supabase.from('contact_messages').update({ handled_at: done ? new Date().toISOString() : null }).eq('id', m.id)).error, 'העדכון')) { toast(done ? 'סומן כטופל ✓' : 'הוחזר לפתוחות'); refresh() }
  }
  const shown = (list ?? []).filter(m => (tab === 'open' ? !m.handled_at : !!m.handled_at))
  const open = (list ?? []).filter(m => !m.handled_at).length

  return (
    <>
      <PageHead title="פניות מהאתר" />
      <Help>כל מי שממלא את טופס "צור קשר" באתר מופיע כאן (ובמקביל נפתחת לו הודעת וואטסאפ לברי). חוזרים אליו בכפתור <b>💬</b>, ואז מסמנים <b>✓ טופל</b>.</Help>
      <div className="ad-tabs">
        <button className={`ad-tab${tab === 'open' ? ' on' : ''}`} onClick={() => setTab('open')}>פתוחות <span className="ad-tab-n">{open}</span></button>
        <button className={`ad-tab${tab === 'done' ? ' on' : ''}`} onClick={() => setTab('done')}>טופלו <span className="ad-tab-n">{(list?.length ?? 0) - open}</span></button>
      </div>
      {!list ? <p>טוען…</p> : shown.length === 0 ? <Empty>{tab === 'open' ? 'אין פניות פתוחות ✓' : 'אין.'}</Empty> : (
        <div className="ad-list">
          {shown.map(m => {
            const w = waLink(m.phone, `היי ${m.name}! כאן ברי מעמותת חיים של אחרים 🐾 קיבלנו את הפנייה שלך באתר`)
            return (
              <div key={m.id} className={`ad-row${m.handled_at ? ' done' : ''}`}>
                <div className="ad-row-main">
                  <b>{m.name} {m.topic && <span className="ad-tag">{m.topic}</span>}</b>
                  {m.message && <span>{m.message}</span>}
                  <span className="ad-muted"><span dir="ltr">{m.phone ?? 'אין טלפון'}</span> · {fmtDate(m.created_at)}</span>
                </div>
                <div className="ad-row-actions">
                  {w && <a className="ad-btn wa sm" href={w} target="_blank" rel="noopener">💬</a>}
                  {m.handled_at ? <button className="ad-link" onClick={() => mark(m, false)}>↩ החזרה</button> : <button className="ad-btn ok sm" onClick={() => mark(m, true)}>✓ טופל</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
