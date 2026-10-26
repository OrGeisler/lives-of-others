import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { DONATE_URL, WA_ADOPT, wa } from '../lib/links'
import { otherLang, useLang } from '../lib/lang'
import { usePageEffects } from '../lib/usePageEffects'

// Main menu — one entry per page (the site was split from one long page into pages, 2026-10). Same menu in English (26.10).
const NAV = [
  { to: '/', label: 'בית', en: 'Home', end: true },
  { to: '/dogs', label: 'הכלבים שלנו', en: 'Our dogs' },
  { to: '/virtual-adoption', label: 'אימוץ וירטואלי', en: 'Virtual adoption' },
  { to: '/homes', label: 'הבתים הקסומים', en: 'The Magical Homes' },
  { to: '/about', label: 'על העמותה', en: 'About us' },
  { to: '/volunteer', label: 'התנדבות', en: 'Volunteer' },
  { to: '/contact', label: 'צור קשר', en: 'Contact' },
]
export const WA_HELLO = (en: boolean) => en ? 'Hi! I found you through the website 🐾' : 'היי! הגעתי דרך האתר 🐾'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { en, t, to } = useLang()
  const other = otherLang(pathname)
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
          <span>{t('קיומנו תלוי בכם — כל תרומה מצילה חיים 🐾', 'We exist only thanks to you — every donation saves lives 🐾')}</span>
          <a href={DONATE_URL} target="_blank" rel="noopener">{t('לתרומה מאובטחת ←', 'Donate securely →')}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="wrap header-inner">
          <Link to={to('/')} className="brand">
            <img src="/assets/img/logo.jpg" alt={t('חיים של אחרים', 'Lives of Others')} />
            <span className="brand-text">
              <strong className="brand-name">{t('חיים של אחרים', 'Lives of Others')}</strong>
              <span className="brand-sub">{t('הצלת כלבים · טיפול · שיקום', 'Rescue · Care · Rehabilitation')}</span>
            </span>
          </Link>
          {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
          <nav className={`main-nav${open ? ' open' : ''}`} onClick={() => setOpen(false)} aria-label={t('ניווט ראשי', 'Main menu')}>
            {NAV.map(n => (
              <NavLink key={n.to} to={to(n.to)} end={n.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>{en ? n.en : n.label}</NavLink>
            ))}
            {en ? <Link className="nav-lang" to={other} lang="he">עברית 🇮🇱</Link> : <Link className="nav-lang" to={other} lang="en">English 🇬🇧</Link>}
          </nav>
          <div className="header-actions">
            {en ? <Link className="lang-switch" to={other} lang="he">עברית</Link> : <Link className="lang-switch" to={other} lang="en">EN</Link>}
            <a className="btn-donate-top btn-donate-life" href={DONATE_URL} target="_blank" rel="noopener">{t('לתרומה', 'Donate')}<span className="donate-long">{t(' מצילת חיים', ' to save lives')}</span> ❤</a>
            <button className="nav-toggle" aria-label={open ? t('סגירת התפריט', 'Close menu') : t('תפריט', 'Menu')} aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
          </div>
        </div>
      </header>
    </>
  )
}

export function SiteFooter() {
  const { en, t, to } = useLang()
  return (
    <footer className="site-footer ft">
      <div className="wrap ft-inner">
        <div className="ft-brand">
          <img src="/assets/img/logo.jpg" alt={t('חיים של אחרים', 'Lives of Others')} />
          <strong>{t('חיים של אחרים', 'Lives of Others')}</strong>
          <span>{t(<>עמותה רשומה (ע"ר 580754083)<br />הצלת כלבים, טיפול ושיקום מאז 2016<br />רמת אפעל וקרית גת</>, <>Registered nonprofit (No. 580754083)<br />Rescuing, caring for and rehabilitating dogs since 2016<br />Ramat Efal and Kiryat Gat, Israel</>)}</span>
          <a className="ft-donate" href={DONATE_URL} target="_blank" rel="noopener">{t('לתרומה מצילת חיים ❤', 'Donate to save lives ❤')}</a>
        </div>
        <nav className="ft-col" aria-label={t('לעזור', 'Help')}>
          <h3>{t('לעזור לכלבים', 'Help the dogs')}</h3>
          <Link to={to('/dogs')}>{t('אימוץ כלב', 'Adopt a dog')}</Link>
          <Link to={to('/virtual-adoption')}>{t('אימוץ וירטואלי', 'Virtual adoption')}</Link>
          <Link to={to('/gift-adoption')}>{t('אימוץ במתנה', 'Adopt as a gift')}</Link>
          <Link to={to('/birthday')}>{t('יום הולדת לכלב', "A dog's birthday")}</Link>
          <Link to={to('/donate')}>{t('תרומה', 'Donate')}</Link>
          <Link to={to('/volunteer')}>{t('התנדבות', 'Volunteer')}</Link>
        </nav>
        <nav className="ft-col" aria-label={t('העמותה', 'The nonprofit')}>
          <h3>{t('העמותה', 'The nonprofit')}</h3>
          <Link to={to('/about')}>{t('על העמותה', 'About us')}</Link>
          <Link to={to('/homes')}>{t('הבתים הקסומים', 'The Magical Homes')}</Link>
          <Link to={to('/contact')}>{t('צור קשר', 'Contact')}</Link>
          <Link to={to('/privacy')}>{t('מדיניות פרטיות ותקנון', 'Privacy policy and terms')}</Link>
          <Link to={to('/accessibility')}>{t('הצהרת נגישות', 'Accessibility statement')}</Link>
        </nav>
        <div className="ft-col">
          <h3>{t('עקבו אחרינו', 'Follow us')}</h3>
          <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">{t('פייסבוק', 'Facebook')}</a>
          <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">{t('אינסטגרם', 'Instagram')}</a>
          <a href={wa(WA_ADOPT, WA_HELLO(en))} target="_blank" rel="noopener">{t('וואטסאפ', 'WhatsApp')}</a>
        </div>
      </div>
      <div className="ft-bottom">© {new Date().getFullYear()} {t('עמותת חיים של אחרים', 'Lives of Others')}</div>
    </footer>
  )
}

function WhatsAppFloat() {
  const { en, t } = useLang()
  // can be hidden for the session (it covered content on phones)
  const [hidden, setHidden] = useState(() => { try { return sessionStorage.getItem('wa-hidden') === '1' } catch { return false } })
  if (hidden) return null
  const hide = () => { setHidden(true); try { sessionStorage.setItem('wa-hidden', '1') } catch { /* private mode */ } }
  return (
    <div className="wa-float-wrap">
    <button type="button" className="wa-float-x" aria-label={t('הסתרת כפתור הוואטסאפ', 'Hide the WhatsApp button')} onClick={hide}>✕</button>
    <a className="wa-float" href={wa(WA_ADOPT, WA_HELLO(en))} target="_blank" rel="noopener" aria-label={t('דברו איתנו בוואטסאפ', 'Chat with us on WhatsApp')} title={t('דברו איתנו בוואטסאפ', 'Chat with us on WhatsApp')}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
    </a>
    </div>
  )
}

export default function Layout() {
  usePageEffects()
  const { en, t } = useLang()
  // <html> language and direction follow the page (English = LTR)
  useEffect(() => {
    const html = document.documentElement
    html.lang = en ? 'en' : 'he'; html.dir = en ? 'ltr' : 'rtl'
  }, [en])
  return (
    <>
      <a className="skip-link" href="#main">{t('דלג לתוכן', 'Skip to content')}</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}><Outlet /></main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
