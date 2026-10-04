import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { focusStyle } from '../lib/focus'
import { supabase } from '../lib/supabase'
import '../styles/certificate.css'

type Cert = {
  type: 'virtual' | 'gift'; id: string; name: string | null; from?: string | null; greeting?: string | null
  dog: string | null; image: string | null; focus: string | null; date: string
}

const heDate = (s: string) => new Date(s).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })

// Personal adoption / gift certificate (A4 landscape). Also rendered to PDF on the server (?pdf=1 hides the buttons).
export default function Certificate() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const pdf = params.has('pdf')
  const [c, setC] = useState<Cert | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'missing'>('loading')
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (pdf) return
    const fit = () => setScale(Math.min(1, (window.innerWidth - 24) / 1123))
    fit(); window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [pdf])

  useEffect(() => {
    supabase.rpc('get_certificate', { p_id: id }).then(({ data, error }) => {
      if (error || !data) { setState('missing'); return }
      setC(data as Cert); setState('ok')
      document.title = `תעודת אימוץ — ${(data as Cert).dog ?? ''} · חיים של אחרים`
    })
  }, [id])
  // tells the PDF renderer the page (fonts + photo) is ready
  useEffect(() => {
    if (state !== 'ok') return
    const img = document.querySelector<HTMLImageElement>('.cert-photo img')
    const ready = () => document.fonts.ready.then(() => document.body.setAttribute('data-cert-ready', '1'))
    if (!img || img.complete) ready(); else { img.onload = ready; img.onerror = ready }
  }, [state])

  if (state === 'loading') return <div className="cert-wait" />
  if (state === 'missing' || !c) return <div className="cert-missing"><h1>התעודה לא נמצאה</h1><p>ייתכן שהקישור שגוי או שהתשלום עוד לא אושר.</p><a href="/">לאתר חיים של אחרים ←</a></div>

  const gift = c.type === 'gift'
  return (
    <div className={`cert-page${pdf ? ' pdf' : ''}`} dir="rtl" lang="he">
      <article className="cert" style={scale < 1 ? { zoom: scale } : undefined}>
        <div className="cert-frame">
          <span className="cert-corner tl" /><span className="cert-corner tr" /><span className="cert-corner bl" /><span className="cert-corner br" />
          <header className="cert-head">
            <img className="cert-logo" src="/assets/img/logo.jpg" alt="חיים של אחרים" />
            <div className="cert-org">עמותת חיים של אחרים</div>
          </header>

          <div className="cert-body">
            <div className="cert-text">
              <div className="cert-kicker">{gift ? 'תעודת אימוץ במתנה' : 'תעודת אימוץ וירטואלי'}</div>
              <h1 className="cert-title">המלאך השומר</h1>
              <div className="cert-rule"><span><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#c8a24a" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg></span></div>
              <p className="cert-line">תעודה זו מוענקת בגאווה ובהוקרה ל</p>
              <div className="cert-name">{c.name}</div>
              <p className="cert-line">
                על היותך המלאך השומר של
              </p>
              <div className="cert-dog">{c.dog}</div>
              {gift && c.from && <p className="cert-from">אימוץ במתנה, באהבה מ{c.from}</p>}
              {gift && c.greeting && <p className="cert-greeting">"{c.greeting}"</p>}
              {!gift && <p className="cert-thanks">בזכותך {c.dog} זוכה לקורת גג בטוחה, מזון איכותי, טיפול רפואי וים של אהבה — עד שימצא בית של ממש.</p>}
            </div>
            <div className="cert-photo">
              {c.image && <img src={c.image} alt={c.dog ?? ''} style={focusStyle({ image_focus: c.focus })} crossOrigin="anonymous" />}
              <svg className="cert-paw" viewBox="0 0 64 64" aria-hidden="true"><g fill="#123A5A"><ellipse cx="32" cy="42" rx="14" ry="12" /><ellipse cx="14" cy="26" rx="6" ry="8" /><ellipse cx="25" cy="15" rx="6" ry="8" /><ellipse cx="39" cy="15" rx="6" ry="8" /><ellipse cx="50" cy="26" rx="6" ry="8" /></g></svg>
            </div>
          </div>

          <footer className="cert-foot">
            <div className="cert-sign"><span className="cert-sign-line" /><span>צוות עמותת חיים של אחרים</span></div>
            <div className="cert-seal" aria-hidden="true"><span>חיים של<br />אחרים</span></div>
            <div className="cert-sign"><span className="cert-date">{heDate(c.date)}</span><span>תאריך</span></div>
          </footer>
          <div className="cert-legal">עמותה רשומה ע"ר 580754083 · lives-of-others.com</div>
        </div>
      </article>
      {!pdf && (
        <div className="cert-actions">
          <button className="btn btn-gold" onClick={() => window.print()}>⬇ הורדה / הדפסה</button>
          <a className="btn btn-outline-green" href="/">לאתר העמותה</a>
        </div>
      )}
    </div>
  )
}
