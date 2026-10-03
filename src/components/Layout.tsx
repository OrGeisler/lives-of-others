import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { DONATE_URL, WA_ADOPT, wa } from '../lib/links'
import { usePageEffects } from '../lib/usePageEffects'

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
            <Link to="/#about">על העמותה</Link>
            <Link to="/#homes">הבתים הקסומים</Link>
            <Link to="/#dogs">הכלבים שלנו</Link>
            <Link to="/virtual-adoption">אימוץ וירטואלי</Link>
            <Link to="/#volunteer">התנדבות</Link>
            <Link to="/#contact">צור קשר</Link>
          </nav>
          <div className="header-actions">
            <Link className="lang-switch" to="/en" lang="en">EN</Link>
            <a className="btn-donate-top btn-donate-life" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מצילת חיים ❤</a>
            <button className="nav-toggle" aria-label="תפריט" aria-expanded={open} onClick={() => setOpen(o => !o)}>☰</button>
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
          <span>עמותה רשומה (ע"ר 580754083) · הצלת כלבים, טיפול ושיקום · פועלת על טהרת ההתנדבות מאז 2016 · רמת אפעל וקרית גת</span>
        </div>
        <div className="footer-links">
          <a className="donate" href={DONATE_URL} target="_blank" rel="noopener">לתרומה</a>
          <Link to="/#dogs">אימוץ</Link>
          <Link to="/virtual-adoption">אימוץ וירטואלי</Link>
          <Link to="/gift-adoption">אימוץ במתנה</Link>
          <Link to="/birthday">יום הולדת 🎂</Link>
          <Link to="/#volunteer">התנדבות</Link>
          <Link to="/#homes">הבתים הקסומים</Link>
          <Link to="/privacy">מדיניות פרטיות</Link>
          <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">פייסבוק</a>
          <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">אינסטגרם</a>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <a className="wa-float" href={wa(WA_ADOPT, 'היי! הגעתי דרך האתר 🐾')} target="_blank" rel="noopener" aria-label="דברו איתנו בוואטסאפ" title="דברו איתנו בוואטסאפ">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
    </a>
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
