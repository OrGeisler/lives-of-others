import { useEffect, useState, type ReactNode } from 'react'

export function Help({ children }: { children: ReactNode }) {
  return <div className="ad-help"><span aria-hidden="true">💡</span><div>{children}</div></div>
}

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="ad-head"><h1>{title}</h1>{children && <div className="ad-head-actions">{children}</div>}</div>
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="ad-field">
      <span className="ad-label">{label}</span>
      {children}
      {hint && <span className="ad-hint">{hint}</span>}
    </label>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="ad-empty">{children}</div>
}

// One toast at a time, auto-hides. Call toast('נשמר ✓') from anywhere.
let push: (m: string, bad?: boolean) => void = () => {}
export const toast = (m: string, bad = false) => push(m, bad)
export function Toaster() {
  const [msg, setMsg] = useState<{ m: string; bad: boolean } | null>(null)
  useEffect(() => { push = (m, bad = false) => setMsg({ m, bad }) }, [])
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 3200)
    return () => clearTimeout(t)
  }, [msg])
  return msg ? <div className={`ad-toast${msg.bad ? ' bad' : ''}`} role="status">{msg.m}</div> : null
}

// Postgres/PostgREST errors are English and technical — translate the common ones for staff
const heError = (e: { message: string; code?: string }) => {
  if (e.code === '23505') return 'כבר קיים פריט עם אותם פרטים (למשל כלב עם אותו שם)'
  if (e.code === '42501' || /permission|row-level security/i.test(e.message)) return 'אין לך הרשאה לפעולה הזו'
  if (e.code === '23503') return 'הפריט קשור לנתונים אחרים ולא ניתן לשנות אותו כך'
  if (/fetch|network|Failed to/i.test(e.message)) return 'אין חיבור לאינטרנט — נסו שוב'
  return e.message
}
export const fail = (e: { message: string; code?: string } | null | undefined, what = 'הפעולה') => {
  if (e) { toast(`${what} לא הצליחה: ${heError(e)}`, true); return true }
  return false
}
