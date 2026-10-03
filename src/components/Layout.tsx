import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

const DONATE_URL = 'http://donation.lives-of-others.org/truma'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
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
          <nav className={`main-nav${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
            <a href="/#about">על העמותה</a>
            <a href="/#homes">הבתים הקסומים</a>
            <a href="/#dogs">הכלבים שלנו</a>
            <a href="/#sponsor">אימוץ וירטואלי</a>
            <a href="/#contact">צור קשר</a>
          </nav>
          <div className="header-actions">
            <a className="btn-donate-top btn-donate-life" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מצילת חיים ❤</a>
            <button className="nav-toggle" aria-label="תפריט" onClick={() => setOpen(o => !o)}>☰</button>
          </div>
        </div>
      </header>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <img src="/assets/img/logo.jpg" alt="חיים של אחרים" />
        <div className="footer-brand">
          <strong>חיים של אחרים · Lives of Others</strong>
          <span>עמותה רשומה (ע"ר 580754083) · הצלת כלבים, טיפול ושיקום · רמת אפעל וקרית גת</span>
        </div>
        <div className="footer-links">
          <a className="donate" href={DONATE_URL} target="_blank" rel="noopener">לתרומה</a>
          <Link to="/">לעמוד הבית</Link>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <>
      <SiteHeader />
      <main><Outlet /></main>
      <SiteFooter />
    </>
  )
}
