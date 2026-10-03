import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../auth'
import { Field, Help, PageHead, fail, toast } from '../ui'

type Invite = { email: string; role: string; name: string | null }
type Member = { user_id: string; email: string; role: string; name: string | null }

export default function Staff() {
  const { session } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [staff, setStaff] = useState<Member[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('editor')

  const refresh = async () => {
    const [i, s] = await Promise.all([supabase.from('staff_invites').select('*').order('created_at'), supabase.from('staff').select('*').order('created_at')])
    setInvites(i.data ?? []); setStaff(s.data ?? [])
  }
  useEffect(() => { refresh() }, [])

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    const em = email.trim().toLowerCase()
    if (!fail((await supabase.from('staff_invites').upsert({ email: em, role, name: name.trim() || null })).error, 'ההוספה')) {
      toast(`${em} נוסף/ה — אפשר להיכנס עכשיו עם המייל הזה`); setEmail(''); setName(''); refresh()
    }
  }
  const remove = async (m: Member) => {
    if (m.user_id === session?.user.id) { toast('אי אפשר להסיר את עצמך', true); return }
    if (!confirm(`להסיר את ${m.name ?? m.email} מהצוות?`)) return
    await supabase.from('staff_invites').delete().eq('email', m.email)
    if (!fail((await supabase.from('staff').delete().eq('user_id', m.user_id)).error, 'ההסרה')) { toast('הוסר/ה'); refresh() }
  }
  const joined = new Set(staff.map(s => s.email.toLowerCase()))

  return (
    <>
      <PageHead title="צוות והרשאות" />
      <Help>
        מוסיפים כאן את המייל של מי שצריך גישה למערכת. אחרי זה הם נכנסים בעמוד הכניסה עם המייל שלהם — בלי סיסמה.<br />
        <b>עורך/ת</b> — יכול/ה לעבוד בכל המסכים. <b>מנהל/ת</b> — גם להוסיף ולהסיר אנשי צוות.
      </Help>
      <form className="ad-box ad-form" onSubmit={add}>
        <div className="ad-grid3">
          <Field label="מייל *"><input type="email" required dir="ltr" value={email} onChange={e => setEmail(e.target.value)} /></Field>
          <Field label="שם"><input value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="הרשאה">
            <select value={role} onChange={e => setRole(e.target.value)}><option value="editor">עורך/ת</option><option value="admin">מנהל/ת</option></select>
          </Field>
        </div>
        <button className="ad-btn primary">➕ הוספה לצוות</button>
      </form>
      <h2 className="ad-h2">בצוות</h2>
      <div className="ad-list">
        {staff.map(m => (
          <div key={m.user_id} className="ad-row">
            <div className="ad-row-main"><b>{m.name ?? m.email}</b><span className="ad-muted" dir="ltr">{m.email}</span></div>
            <span className="ad-tag">{m.role === 'admin' ? 'מנהל/ת' : 'עורך/ת'}</span>
            <button className="ad-link" onClick={() => remove(m)}>הסרה</button>
          </div>
        ))}
        {invites.filter(i => !joined.has(i.email.toLowerCase())).map(i => (
          <div key={i.email} className="ad-row">
            <div className="ad-row-main"><b>{i.name ?? i.email}</b><span className="ad-muted" dir="ltr">{i.email}</span></div>
            <span className="ad-tag gray">עוד לא נכנס/ה</span>
            <button className="ad-link" onClick={async () => { await supabase.from('staff_invites').delete().eq('email', i.email); refresh() }}>ביטול</button>
          </div>
        ))}
      </div>
    </>
  )
}
