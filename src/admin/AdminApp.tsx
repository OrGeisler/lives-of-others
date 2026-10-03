import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/admin.css'
import { AuthProvider, useAuth } from './auth'
import { Toaster } from './ui'
import Dashboard from './pages/Dashboard'
import Dogs from './pages/Dogs'
import DogEdit from './pages/DogEdit'
import Sponsors from './pages/Sponsors'
import ToSend from './pages/ToSend'
import Gifts from './pages/Gifts'
import Birthdays from './pages/Birthdays'
import SiteContent from './pages/SiteContent'
import Payments from './pages/Payments'
import Staff from './pages/Staff'

const NAV = [
  { to: '/admin', icon: '🏠', label: 'ראשי', end: true },
  { to: '/admin/to-send', icon: '💬', label: 'לשליחה' },
  { to: '/admin/sponsors', icon: '😇', label: 'מאמצים' },
  { to: '/admin/gifts', icon: '🎁', label: 'מתנות' },
  { to: '/admin/dogs', icon: '🐶', label: 'כלבים' },
  { to: '/admin/birthdays', icon: '🎂', label: 'ימי הולדת' },
  { to: '/admin/payments', icon: '💳', label: 'תשלומים' },
  { to: '/admin/site', icon: '✏️', label: 'תוכן האתר' },
]

function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${location.origin}/admin` } })
    setBusy(false)
    if (error) setErr(error.message.includes('rate') ? 'נשלחו יותר מדי מיילים. נסו שוב בעוד כמה דקות.' : error.message)
    else setSent(true)
  }
  return (
    <div className="ad-login">
      <img src="/assets/img/logo.jpg" alt="" />
      <h1>מערכת הניהול</h1>
      <p className="ad-login-sub">חיים של אחרים 🐾</p>
      {sent ? (
        <div className="ad-login-sent">
          <p className="big">📬 שלחנו לך מייל!</p>
          <p>פתחו את המייל <b>{email}</b> ולחצו על הקישור — וזהו, אתם בפנים.</p>
          <p className="ad-hint">המייל מגיע באנגלית, בשם "Supabase Auth" עם הכותרת "Your Magic Link" או "Confirm Your Signup". לא הגיע? בדקו בספאם.</p>
          <button className="ad-btn ghost" onClick={() => setSent(false)}>שליחה שוב / מייל אחר</button>
        </div>
      ) : (
        <form onSubmit={send}>
          <label className="ad-field">
            <span className="ad-label">כתובת המייל שלכם</span>
            <input type="email" required autoComplete="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" />
          </label>
          <button className="ad-btn primary big" disabled={busy}>{busy ? 'שולח…' : 'שלחו לי קישור כניסה'}</button>
          {err && <p className="ad-error">{err}</p>}
          <p className="ad-hint">אין סיסמה לזכור — בכל כניסה נשלח קישור למייל.</p>
        </form>
      )}
    </div>
  )
}

function NoAccess() {
  const { session, signOut } = useAuth()
  return (
    <div className="ad-login">
      <h1>אין עדיין הרשאה</h1>
      <p>המייל <b dir="ltr">{session?.user.email}</b> לא מוגדר כחלק מהצוות.</p>
      <p>בקשו ממנהל/ת המערכת להוסיף אותו במסך "צוות", ואז היכנסו שוב.</p>
      <button className="ad-btn ghost" onClick={signOut}>יציאה</button>
    </div>
  )
}

function Shell() {
  const { session, role, loading, signOut } = useAuth()
  useEffect(() => { document.title = 'ניהול — חיים של אחרים' }, [])
  if (loading) return <div className="ad-login"><p>טוען…</p></div>
  if (!session) return <Login />
  if (!role) return <NoAccess />
  return (
    <div className="ad-shell">
      <aside className="ad-nav">
        <div className="ad-brand"><img src="/assets/img/logo.jpg" alt="" /><span>ניהול</span></div>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `ad-nav-link${isActive ? ' on' : ''}`}>
            <span className="ad-nav-ico" aria-hidden="true">{n.icon}</span><span>{n.label}</span>
          </NavLink>
        ))}
        {role === 'admin' && (
          <NavLink to="/admin/staff" className={({ isActive }) => `ad-nav-link${isActive ? ' on' : ''}`}>
            <span className="ad-nav-ico" aria-hidden="true">👥</span><span>צוות</span>
          </NavLink>
        )}
        <div className="ad-nav-foot">
          <a href="/" target="_blank" rel="noopener">לאתר ↗</a>
          <button onClick={signOut}>יציאה</button>
        </div>
      </aside>
      <main className="ad-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="to-send" element={<ToSend />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="gifts" element={<Gifts />} />
          <Route path="dogs" element={<Dogs />} />
          <Route path="dogs/:id" element={<DogEdit />} />
          <Route path="birthdays" element={<Birthdays />} />
          <Route path="payments" element={<Payments />} />
          <Route path="site" element={<SiteContent />} />
          {role === 'admin' && <Route path="staff" element={<Staff />} />}
        </Routes>
      </main>
      <Toaster />
    </div>
  )
}

export default function AdminApp() {
  return <AuthProvider><Shell /></AuthProvider>
}
