import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/a11y.css'

// Accessibility menu (our own, no third-party widget): text size, contrast, links, font, motion.
// Choices are classes on <html> and are remembered in this browser only.
type Prefs = { size: 0 | 1 | 2; contrast: boolean; links: boolean; font: boolean; still: boolean }
const OFF: Prefs = { size: 0, contrast: false, links: false, font: false, still: false }
const KEY = 'a11y-prefs'

function load(): Prefs {
  try { return { ...OFF, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return OFF }
}

export default function A11yMenu() {
  const { pathname } = useLocation()
  const en = pathname.startsWith('/en')
  const L = (he: string, eng: string) => (en ? eng : he)
  const [open, setOpen] = useState(false)
  const [p, setP] = useState<Prefs>(load)

  useEffect(() => {
    const c = document.documentElement.classList
    c.toggle('a11y-size-1', p.size === 1)
    c.toggle('a11y-size-2', p.size === 2)
    c.toggle('a11y-contrast', p.contrast)
    c.toggle('a11y-links', p.links)
    c.toggle('a11y-font', p.font)
    c.toggle('a11y-still', p.still)
    if (p.still) document.querySelectorAll('video').forEach(v => { v.autoplay = false; v.pause() })
    try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* private mode */ }
  }, [p, pathname])

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const flip = (k: 'contrast' | 'links' | 'font' | 'still') => setP(s => ({ ...s, [k]: !s[k] }))
  const opt = (k: 'contrast' | 'links' | 'font' | 'still', label: string) => (
    <button type="button" className="a11y-opt" aria-pressed={p[k]} onClick={() => flip(k)}>{label}</button>
  )

  return (
    <div className="a11y" dir={en ? 'ltr' : 'rtl'} lang={en ? 'en' : 'he'}>
      <button type="button" className="a11y-btn" aria-expanded={open} aria-controls="a11y-panel"
        aria-label={L('תפריט נגישות', 'Accessibility menu')} title={L('נגישות', 'Accessibility')} onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2" /><path d="M4 8.5l8 1.5 8-1.5.4 2-6.4 1.3V15l2 6-2 .6-2-5.6-2 5.6-2-.6 2-6v-3.2L3.6 10.5z" /></svg>
      </button>
      {open && (
        <div className="a11y-panel" id="a11y-panel" role="dialog" aria-label={L('תפריט נגישות', 'Accessibility menu')}>
          <div className="a11y-head">
            <strong>{L('נגישות', 'Accessibility')}</strong>
            <button type="button" className="a11y-x" aria-label={L('סגירה', 'Close')} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="a11y-size" role="group" aria-label={L('גודל טקסט', 'Text size')}>
            <span>{L('גודל טקסט', 'Text size')}</span>
            {([0, 1, 2] as const).map(s => (
              <button key={s} type="button" aria-pressed={p.size === s} onClick={() => setP(x => ({ ...x, size: s }))}
                style={{ fontSize: 14 + s * 3 }}>{['A', 'A+', 'A++'][s]}</button>
            ))}
          </div>
          {opt('contrast', L('ניגודיות גבוהה', 'High contrast'))}
          {opt('links', L('הדגשת קישורים', 'Highlight links'))}
          {opt('font', L('גופן קריא', 'Readable font'))}
          {opt('still', L('עצירת אנימציות וסרטונים', 'Stop animations and videos'))}
          <button type="button" className="a11y-reset" onClick={() => setP(OFF)}>{L('איפוס', 'Reset')}</button>
          <Link className="a11y-link" to={en ? '/en/accessibility' : '/accessibility'} onClick={() => setOpen(false)}>
            {L('הצהרת נגישות', 'Accessibility statement')}
          </Link>
        </div>
      )}
    </div>
  )
}
