import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { DONATE_URL, WA_ADOPT, wa } from '../lib/links'
import { usePageEffects } from '../lib/usePageEffects'

// Main menu — one entry per page (the site was split from one long page into pages, 2026-10)
const NAV = [
  { to: '/', label: 'בית', end: true },
  { to: '/dogs', label: 'הכלבים שלנו' },
  { to: '/virtual-adoption', label: 'אימוץ וירטואלי' },
  { to: '/homes', label: 'הבתים הקסומים' },
  { to: '/about', label: 'על העמותה' },
  { to: '/volunteer', label: 'התנדבות' },
  { to: '/contact', label: 'צור קשר' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])
  // close with Esc; lock page scroll while the phone menu is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])
  return (
    <>
      <div className="top-bar">
        <div className="wrap">
          <span>קיומנו תלוי בכם — כל תרומה מצילה חיים 🐾</span>
          <a href={DONATE_URL} target="_blank" rel="noopener">לתרומה מאובטחת ←</a>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link to="/" className="brand">
            <img src="/assets/img/logo.jpg" alt="חיים של אחרים" />
            <span className="brand-text">
              <strong className="brand-name">חיים של אחרים</strong>
              <span className="brand-sub">הצלת כלבים · טיפול · שיקום</span>
            </span>
          </Link>
          {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
          <nav className={`main-nav${open ? ' open' : ''}`} onClick={() => setOpen(false)} aria-label="ניווט ראשי">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>{n.label}</NavLink>
            ))}
            <Link className="nav-lang" to="/en" lang="en">English 🇬🇧</Link>
          </nav>
          <div className="header-actions">
            <Link className="lang-switch" to="/en" lang="en">EN</Link>
            <a className="btn-donate-top btn-donate-life" href={DONATE_URL} target="_blank" rel="noopener">לתרומה<span className="donate-long"> מצילת חיים</span> ❤</a>
            <button className="nav-toggle" aria-label={open ? 'סגירת התפריט' : 'תפריט'} aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
          </div>
        </div>
      </header>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer ft">
      <div className="wrap ft-inner">
        <div className="ft-brand">
          <img src="/assets/img/logo.jpg" alt="חיים של אחרים" />
          <strong>חיים של אחרים</strong>
          <span>עמותה רשומה (ע"ר 580754083)<br />הצלת כלבים, טיפול ושיקום מאז 2016<br />רמת אפעל וקרית גת</span>
          <a className="ft-donate" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מצילת חיים ❤</a>
        </div>
        <nav className="ft-col" aria-label="לעזור">
          <h3>לעזור לכלבים</h3>
          <Link to="/dogs">אימוץ כלב</Link>
          <Link to="/virtual-adoption">אימוץ וירטואלי</Link>
          <Link to="/gift-adoption">אימוץ במתנה</Link>
          <Link to="/birthday">יום הולדת לכלב</Link>
          <Link to="/donate">תרומה</Link>
          <Link to="/volunteer">התנדבות</Link>
        </nav>
        <nav className="ft-col" aria-label="העמותה">
          <h3>העמותה</h3>
          <Link to="/about">על העמותה</Link>
          <Link to="/homes">הבתים הקסומים</Link>
          <Link to="/contact">צור קשר</Link>
          <Link to="/privacy">מדיניות פרטיות ותקנון</Link>
        </nav>
        <div className="ft-col">
          <h3>עקבו אחרינו</h3>
          <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">פייסבוק</a>
          <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">אינסטגרם</a>
          <a href={wa(WA_ADOPT, 'היי! הגעתי דרך האתר 🐾')} target="_blank" rel="noopener">וואטסאפ</a>
        </div>
      </div>
      <div className="ft-bottom">© {new Date().getFullYear()} עמותת חיים של אחרים</div>
    </footer>
  )
}

function WhatsAppFloat() {
  // can be hidden for the session (it covered content on phones)
  const [hidden, setHidden] = useState(() => { try { return sessionStorage.getItem('wa-hidden') === '1' } catch { return false } })
  if (hidden) return null
  const hide = () => { setHidden(true); try { sessionStorage.setItem('wa-hidden', '1') } catch { /* private mode */ } }
  return (
    <div className="wa-float-wrap">
    <button type="button" className="wa-float-x" aria-label="הסתרת כפתור הוואטסאפ" onClick={hide}>✕</button>
    <a className="wa-float" href={wa(WA_ADOPT, 'היי! הגעתי דרך האתר 🐾')} target="_blank" rel="noopener" aria-label="דברו איתנו בוואטסאפ" title="דברו איתנו בוואטסאפ">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
    </a>
    </div>
  )
}

export default function Layout() {
  usePageEffects()
  return (
    <>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
