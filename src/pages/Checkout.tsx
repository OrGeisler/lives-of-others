import { focusStyle } from '../lib/focus'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { submitCheckout } from '../lib/checkout'
import { isTestMode } from '../lib/links'
import { GIFT_SUM, SOURCES, localDate } from '../lib/constants'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'
import '../styles/checkout.css'


// Our own details form (24.9: "לכבוד" instead of first/last/company, no address, "how did you hear of us",
// terms + mailing consent). Details are saved first; payment then happens on Grow's secure page.
export default function Checkout() {
  const [params] = useSearchParams()
  const type = params.get('type') === 'gift' ? 'gift' : 'virtual'
  const tier = Number(params.get('tier')) || 50
  const { data: dog, loading } = useDog(params.get('dog') ?? '')
  useTitle(type === 'gift' ? 'אימוץ במתנה — השלמת פרטים' : 'אימוץ וירטואלי — השלמת פרטים')

  const [f, setF] = useState({ honor_name: '', phone: '', email: '', source: '', consent_terms: false, consent_marketing: false, website: '' })
  const [g, setG] = useState({ name: '', phone: '', email: '', greeting: '', send_at: localDate() })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [payUrl, setPayUrl] = useState('')
  useEffect(() => { if (payUrl) window.location.href = payUrl }, [payUrl])

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>טוען…</div>
  if (!dog) return <div className="wrap" style={{ padding: '80px 0' }}>לא נבחר כלב. <Link to={type === 'gift' ? '/gift-adoption' : '/virtual-adoption#choose'}>לבחירת כלב ←</Link></div>

  const sum = type === 'gift' ? GIFT_SUM : tier
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || payUrl) return
    setBusy(true); setErr('')
    const r = await submitCheckout({ type, dog: dog.slug, tier, ...f, test: isTestMode(), gift: type === 'gift' ? g : undefined })
    if (r.error || !r.redirect) { setBusy(false); setErr(r.error ?? 'משהו השתבש, נסו שוב'); return }
    setPayUrl(r.redirect) // stays busy until the browser leaves for the payment page
  }
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(x => ({ ...x, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))
  const updG = (k: keyof typeof g) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setG(x => ({ ...x, [k]: e.target.value }))

  return (
    <section className="co">
      {isTestMode() && <p className="co-error" style={{ textAlign: 'center' }}>🧪 מצב בדיקה — התשלום יעבור לדף הבדיקות (1/2/3 ₪). לחזרה למצב רגיל: ‎?test=0</p>}
      <h1 className="co-title">{type === 'gift' ? 'השלמת המתנה 🎁' : 'השלמת האימוץ 😇'}</h1>
      <div className="co-grid">
        <aside className="co-summary">
          <h2>{type === 'gift' ? 'המתנה שלכם' : 'האימוץ שלכם'}</h2>
          <div className="co-item">
            {dog.main_image && <img src={dog.main_image} style={focusStyle(dog)} alt={dog.name} />}
            <div>
              <b>{type === 'gift' ? `אימוץ וירטואלי של ${dog.name} במתנה` : `המלאך השומר של ${dog.name}`}</b>
              <span>{type === 'gift' ? 'תרומה חד-פעמית' : 'הוראת קבע חודשית'}</span>
            </div>
          </div>
          <div className="co-total"><span>סה"כ</span><b>{sum} ₪{type === 'virtual' ? ' / חודש' : ''}</b></div>
          <Link className="co-change" to={type === 'gift' ? '/gift-adoption' : `/virtual-adoption/${dog.slug}`}>שינוי בחירה</Link>
        </aside>

        <form className="co-form" onSubmit={submit} noValidate={false}>
          <h2>{type === 'gift' ? 'פרטי נותן/ת המתנה' : 'הפרטים שלכם'}</h2>
          <label className="co-field"><span>לכבוד * <small>(השם שעליו תצא הקבלה)</small></span>
            <input required autoComplete="name" value={f.honor_name} onChange={upd('honor_name')} /></label>
          <div className="co-2">
            <label className="co-field"><span>טלפון נייד *</span><input required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="050-0000000" value={f.phone} onChange={upd('phone')} /></label>
            <label className="co-field"><span>מייל *</span><input required type="email" autoComplete="email" dir="ltr" value={f.email} onChange={upd('email')} /></label>
          </div>
          <label className="co-field"><span>איך הגעתם אלינו?</span>
            <select value={f.source} onChange={upd('source')}><option value="">בחרו…</option>{Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>

          {type === 'gift' && (
            <>
              <h2>למי המתנה? 🎁</h2>
              <div className="co-2">
                <label className="co-field"><span>שם מקבל/ת המתנה *</span><input required value={g.name} onChange={updG('name')} /></label>
                <label className="co-field"><span>הטלפון שלו/ה <small>(לשליחת ההפתעה)</small></span><input type="tel" inputMode="tel" dir="ltr" value={g.phone} onChange={updG('phone')} /></label>
              </div>
              <div className="co-2">
                <label className="co-field"><span>המייל שלו/ה</span><input type="email" dir="ltr" value={g.email} onChange={updG('email')} /></label>
                <label className="co-field"><span>מתי לשלוח את ההפתעה?</span><input type="date" min={localDate()} value={g.send_at} onChange={updG('send_at')} /></label>
              </div>
              <label className="co-field"><span>הברכה האישית שלכם</span><textarea rows={3} maxLength={600} placeholder="מזל טוב! ..." value={g.greeting} onChange={updG('greeting')} /></label>
            </>
          )}

          <input className="co-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={upd('website')} name="website" />
          <label className="co-check"><input type="checkbox" required checked={f.consent_terms} onChange={upd('consent_terms')} /> קראתי ואני מאשר/ת את <Link to="/privacy" target="_blank">התקנון ומדיניות הפרטיות</Link> *</label>
          <label className="co-check"><input type="checkbox" checked={f.consent_marketing} onChange={upd('consent_marketing')} /> אשמח לקבל עדכונים וסיפורי הצלה מהעמותה</label>

          {err && <p className="co-error" role="alert">{err}</p>}
          <button className="btn btn-angel co-submit" disabled={busy}>
            <span className="angel-l1">{payUrl ? 'מעבירים לתשלום…' : busy ? 'שומר…' : `להמשך לתשלום מאובטח · ${sum} ₪`}</span>
          </button>
          <p className="co-note">🔒 התשלום מתבצע בדף המאובטח של Grow — בכרטיס אשראי, ביט או Google Pay. בסיום תישלח אליכם קבלה למייל.</p>
        </form>
      </div>
    </section>
  )
}
