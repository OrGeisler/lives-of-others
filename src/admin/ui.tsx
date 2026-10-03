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

export const fail = (e: { message: string } | null | undefined, what = 'הפעולה') => {
  if (e) { toast(`${what} לא הצליחה: ${e.message}`, true); return true }
  return false
}
