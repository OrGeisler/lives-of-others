import { focusStyle } from '../lib/focus'
import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { submitCheckout } from '../lib/checkout'
import { isTestMode } from '../lib/links'
import { GIFT_SUM, SOURCES, localDate } from '../lib/constants'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'
import '../styles/checkout.css'


// Our own details form (24.9: "לכבוד" instead of first/last/company, no address, "how did you hear of us",
// terms + mailing consent). Details are saved first; payment then happens on Grow's secure page.
const SOURCES_EN: Record<string, string> = { friends: 'Friends / family', facebook: 'Facebook', instagram: 'Instagram', volunteering: 'Volunteering', news: 'News / media', other: 'Other' }
// the checkout function answers in Hebrew; English for the /en form
const ERR_EN: Record<string, string> = {
  'בקשה לא תקינה': 'Invalid request', 'הכלב שנבחר לא זמין כרגע': 'The chosen dog is not available right now',
  'המייל של מקבל/ת המתנה לא תקין': "The recipient's email is not valid", 'יש לאשר את התקנון ומדיניות הפרטיות': 'Please accept the terms and privacy policy',
  'כתובת המייל לא תקינה': 'The email address is not valid', 'מספר הטלפון לא תקין': 'The phone number is not valid',
  'נא לבחור מסלול': 'Please choose an amount', 'נא למלא את שם מקבל/ת המתנה': "Please fill in the recipient's name",
  'נא למלא שם לכבוד': 'Please fill in your name', 'הטלפון של מקבל/ת המתנה לא תקין': "The recipient's phone is not valid",
  'נא למלא את הטלפון של מקבל/ת המתנה': "Please fill in the recipient's phone",
}
const errEn = (e?: string) => (e && ERR_EN[e]) || 'Something went wrong, please try again'

export default function Checkout() {
  const [params] = useSearchParams()
  const type = params.get('type') === 'gift' ? 'gift' : 'virtual'
  // ?lang=en: the same form in English (from /en). Payment still on the same Grow pages.
  const en = useLocation().pathname.startsWith('/en') || params.get('lang') === 'en'
  const L = (he: string, eng: string) => (en ? eng : he)
  const tier = Number(params.get('tier')) || 50
  const { data: dog, loading } = useDog(params.get('dog') ?? '')
  useTitle(type === 'gift' ? (en ? 'Gift adoption — your details' : 'אימוץ במתנה — השלמת פרטים') : (en ? 'Virtual adoption — your details' : 'אימוץ וירטואלי — השלמת פרטים'))
  useEffect(() => {
    if (!en) return
    const html = document.documentElement
    html.lang = 'en'; html.dir = 'ltr'
    return () => { html.lang = 'he'; html.dir = 'rtl' }
  }, [en])

  const [f, setF] = useState({ honor_name: '', phone: '', email: '', source: '', consent_terms: false, consent_marketing: false, website: '' })
  const [g, setG] = useState({ name: '', phone: '', email: '', greeting: '', send_at: localDate() })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [payUrl, setPayUrl] = useState('')
  useEffect(() => { if (payUrl) window.location.href = payUrl }, [payUrl])

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>{L('טוען…', 'Loading…')}</div>
  if (!dog) return <div className="wrap" style={{ padding: '80px 0' }}>{L('לא נבחר כלב.', 'No dog was chosen.')} <Link to={en ? '/en#virtual' : type === 'gift' ? '/gift-adoption' : '/virtual-adoption#choose'}>{L('לבחירת כלב ←', 'Choose a dog →')}</Link></div>

  const sum = type === 'gift' ? GIFT_SUM : tier
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || payUrl) return
    if (type === 'gift' && !g.phone.trim()) { setErr(L('יש למלא את הטלפון של מקבל/ת המתנה — כדי שההפתעה תגיע אליו/ה בוואטסאפ', "Please fill in the recipient's phone, so the surprise reaches them on WhatsApp")); return }
    setBusy(true); setErr('')
    const r = await submitCheckout({ type, dog: dog.slug, tier, ...f, test: isTestMode(), gift: type === 'gift' ? g : undefined })
    if (r.error || !r.redirect) { setBusy(false); setErr(en ? errEn(r.error) : r.error ?? 'משהו השתבש, נסו שוב'); return }
    setPayUrl(r.redirect) // stays busy until the browser leaves for the payment page
  }
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(x => ({ ...x, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))
  const updG = (k: keyof typeof g) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setG(x => ({ ...x, [k]: e.target.value }))

  return (
    <>
    {/* /en/checkout lives outside the Hebrew layout: a small English header instead */}
    {en && (
      <header className="co-en-head" dir="ltr">
        <Link to="/en" className="co-en-brand"><img src="/assets/img/logo.jpg" alt="" />Lives of Others</Link>
        <Link to="/en">← Back to the site</Link>
      </header>
    )}
    <section className="co" dir={en ? 'ltr' : undefined} lang={en ? 'en' : undefined}>
      {isTestMode() && <p className="co-error" style={{ textAlign: 'center' }}>🧪 מצב בדיקה — התשלום יעבור לדף הבדיקות (1/2/3 ₪). לחזרה למצב רגיל: ‎?test=0</p>}
      <h1 className="co-title">{type === 'gift' ? L('השלמת המתנה 🎁', 'Complete your gift 🎁') : L('השלמת האימוץ 😇', 'Complete your adoption 😇')}</h1>
      <div className="co-grid">
        <aside className="co-summary">
          <h2>{type === 'gift' ? L('המתנה שלכם', 'Your gift') : L('האימוץ שלכם', 'Your adoption')}</h2>
          <div className="co-item">
            {dog.main_image && <img src={dog.main_image} style={focusStyle(dog)} alt={dog.name} />}
            <div>
              <b>{type === 'gift' ? L(`אימוץ וירטואלי של ${dog.name} במתנה`, `Virtual adoption of ${dog.name_en || dog.name} as a gift`) : L(`המלאך השומר של ${dog.name}`, `Guardian angel of ${dog.name_en || dog.name}`)}</b>
              <span>{type === 'gift' ? L('תרומה חד-פעמית', 'One-time donation') : L('הוראת קבע חודשית', 'Monthly standing order')}</span>
            </div>
          </div>
          <div className="co-total"><span>{L('סה"כ', 'Total')}</span><b>{sum} ₪{type === 'virtual' ? L(' / חודש', ' / month') : ''}</b></div>
          <Link className="co-change" to={en ? (type === 'gift' ? '/en#gift' : '/en#virtual') : type === 'gift' ? '/gift-adoption' : `/virtual-adoption/${dog.slug}`}>{L('שינוי בחירה', 'Change')}</Link>
        </aside>

        <form className="co-form" onSubmit={submit} noValidate={false}>
          <h2>{type === 'gift' ? L('פרטי נותן/ת המתנה', 'Your details (the giver)') : L('הפרטים שלכם', 'Your details')}</h2>
          <label className="co-field"><span>{L('לכבוד', 'Name')} * <small>{L('(השם שעליו תצא הקבלה)', '(the name for the receipt)')}</small></span>
            <input required autoComplete="name" value={f.honor_name} onChange={upd('honor_name')} /></label>
          <div className="co-2">
            <label className="co-field"><span>{L('טלפון נייד', 'Mobile phone')} *</span><input required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder={L("050-0000000", "050-0000000 or +1 555 000 0000")} value={f.phone} onChange={upd('phone')} /></label>
            <label className="co-field"><span>{L('מייל', 'Email')} *</span><input required type="email" autoComplete="email" dir="ltr" value={f.email} onChange={upd('email')} /></label>
          </div>
          <label className="co-field"><span>{L('איך הגעתם אלינו?', 'How did you hear about us?')}</span>
            <select value={f.source} onChange={upd('source')}><option value="">{L('בחרו…', 'Choose…')}</option>{Object.entries(SOURCES).map(([k, v]) => <option key={k} value={k}>{en ? SOURCES_EN[k] ?? v : v}</option>)}</select></label>

          {type === 'gift' && (
            <>
              <h2>{L('למי המתנה? 🎁', 'Who is the gift for? 🎁')}</h2>
              <div className="co-2">
                <label className="co-field"><span>{L('שם מקבל/ת המתנה', "Recipient's name")} *</span><input required value={g.name} onChange={updG('name')} /></label>
                <label className="co-field"><span>{L('הטלפון שלו/ה', 'Their phone')} * <small>{L('(לשליחה בוואטסאפ)', '(for WhatsApp)')}</small></span><input required type="tel" inputMode="tel" dir="ltr" placeholder="050-0000000" value={g.phone} onChange={updG('phone')} /></label>
              </div>
              <div className="co-2">
                <label className="co-field"><span>{L('המייל שלו/ה', 'Their email')} <small>{L('(לא חובה)', '(optional)')}</small></span><input type="email" dir="ltr" value={g.email} onChange={updG('email')} /></label>
                <label className="co-field"><span>{L('מתי לשלוח את ההפתעה?', 'When should we send the surprise?')}</span><input type="date" min={localDate()} value={g.send_at} onChange={updG('send_at')} /></label>
              </div>
              <p className="co-hint">💌 {L('ביום שתבחרו נשלח לו/ה בוואטסאפ הודעה אישית מהעמותה עם הברכה שלכם ותעודת האימוץ. אם תוסיפו מייל — נשלח גם אליו.', 'On the day you choose we will send them a personal WhatsApp message with your greeting and the adoption certificate. If you add an email, we will send it there too.')}</p>
              <label className="co-field"><span>{L('הברכה האישית שלכם', 'Your personal greeting')}</span><textarea rows={3} maxLength={600} placeholder={L('מזל טוב! ...', 'Happy birthday! ...')} value={g.greeting} onChange={updG('greeting')} /></label>
            </>
          )}

          <input className="co-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={upd('website')} name="website" />
          <label className="co-check"><input type="checkbox" required checked={f.consent_terms} onChange={upd('consent_terms')} /> {L('קראתי ואני מאשר/ת את', 'I have read and accept the')} <Link to="/privacy" target="_blank">{L('התקנון ומדיניות הפרטיות', 'terms and privacy policy (Hebrew)')}</Link> *</label>
          <label className="co-check"><input type="checkbox" checked={f.consent_marketing} onChange={upd('consent_marketing')} /> {L('אשמח לקבל עדכונים וסיפורי הצלה מהעמותה', "I'd love to receive updates and rescue stories")}</label>

          {err && <p className="co-error" role="alert">{err}</p>}
          <button className="btn btn-angel co-submit" disabled={busy}>
            <span className="angel-l1">{payUrl ? L('מעבירים לתשלום…', 'Taking you to payment…') : busy ? L('שומר…', 'Saving…') : L(`להמשך לתשלום מאובטח · ${sum} ₪`, `Continue to secure payment · ₪${sum}`)}</span>
          </button>
          <p className="co-note">🔒 {L('התשלום מתבצע בדף המאובטח של Grow — בכרטיס אשראי, ביט או Google Pay. בסיום תישלח אליכם קבלה למייל.', "Payment is made on Grow's secure Israeli payment page (in Hebrew) — credit card, Bit or Google Pay. A receipt is emailed to you at the end.")}</p>
        </form>
      </div>
    </section>
    </>
  )
}
