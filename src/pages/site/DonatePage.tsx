import { Link } from 'react-router-dom'
import { Updates } from '../../components/home/StaticSections'
import { useCounters } from '../../lib/data'
import { DONATE_URL, GROW_ITEMS } from '../../lib/links'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import '../../styles/donate.css'

// Faces framed by eye (same set as the Grow cover)
const DOGS: [string, string][] = [
  ['/assets/img/dog-shuki-1.jpg', '50% 18%'], ['/assets/img/dog-micha-1.jpg', '50% 25%'], ['/assets/img/dog-pil-1.jpg', '50% 12%'],
  ['/assets/img/dog-gili-2.jpg', '50% 25%'], ['/assets/img/dog-bella-3.jpg', '50% 22%'],
]

// What a donation does — the nonprofit's own wording (24.9 tiers)
const IMPACT = [
  { amt: 25, ico: '🦴', text: 'אוכל איכותי וחטיפים שהכלבים הכי אוהבים' },
  { amt: 50, ico: '💉', text: 'אוכל איכותי, חיסונים בשגרה וטיפולים רפואיים' },
  { amt: 100, ico: '🏡', text: 'טיפולים רפואיים מצילי חיים ותחזוקת מתחם בית המחסה' },
]

export default function DonatePage() {
  useTitle('תרומה — חיים של אחרים')
  const counters = useCounters().data?.value ?? []
  const n = (label: string) => counters.find(c => c.label.includes(label))
  const dogs = n('בחסותנו'), costs = n('עלויות'), saved = n('שהצלנו')

  return (
    <>
      <section className="dn-hero">
        <div className="dn-strip" aria-hidden="true">
          {DOGS.map(([src, pos]) => <img key={src} src={src} alt="" style={{ objectPosition: pos }} />)}
        </div>
        <div className="dn-hero-text">
          <span className="dn-kicker">כל תרומה מצילה חיים</span>
          <h1>הם מחכים לכם 🐾</h1>
          <p>מאחורי כל פרצוף כאן יש סיפור של נטישה — ושל הצלה. התרומה שלכם היא האוכל, הטיפול והבית שלהם, כל יום מחדש.</p>
          <div className="dn-cta">
            <a className="btn dn-main" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מאובטחת ❤</a>
            <Link className="btn dn-second" to="/virtual-adoption">לאמץ כלב וירטואלית</Link>
          </div>
        </div>
      </section>

      {(dogs || costs) && (
        <section className="dn-facts">
          {saved && <div><b>{saved.value.toLocaleString('he-IL')}</b><span>כלבים שהצלנו מאז 2016</span></div>}
          {dogs && <div><b>{dogs.value.toLocaleString('he-IL')}</b><span>כלבים בחסותנו היום</span></div>}
          {costs && <div><b>{costs.value.toLocaleString('he-IL')}{costs.suffix}</b><span>עולה לנו כל חודש להחזיק את בתי המחסה</span></div>}
          <p className="dn-facts-note">אנחנו עמותה על טהרת ההתנדבות — קיומנו תלוי אך ורק בתרומות.</p>
        </section>
      )}

      <section className="dn-impact">
        <h2>מה התרומה שלכם עושה</h2>
        <div className="dn-impact-grid">
          {IMPACT.map(i => (
            <a key={i.amt} className="dn-impact-card" href={DONATE_URL} target="_blank" rel="noopener">
              <span className="dn-ico">{i.ico}</span>
              <b>{i.amt} ₪</b>
              <span>{i.text}</span>
              <em>לתרומה ←</em>
            </a>
          ))}
        </div>
      </section>

      <section className="dn-ways">
        <h2>דרכים לתרום</h2>
        <div className="dn-ways-grid">
          <div className="dn-way">
            <h3>💳 אשראי — חד-פעמי או הוראת קבע</h3>
            <p>תרומה מאובטחת בכרטיס אשראי או בביט, עם קבלה למייל.</p>
            <a className="dn-link" href={DONATE_URL} target="_blank" rel="noopener">לדף התרומה המאובטח ←</a>
          </div>
          <div className="dn-way">
            <h3>📱 ביט / פייבוקס</h3>
            <p>ביט: <b dir="ltr">052-8296622</b><br />פייבוקס: <b dir="ltr">054-6881116</b></p>
            <a className="dn-link" href="https://links.payboxapp.com/mr8NxOzWKUb" target="_blank" rel="noopener">לתשלום בפייבוקס ←</a>
          </div>
          <div className="dn-way">
            <h3>🏦 העברה בנקאית</h3>
            <p>למוטב: <b>חיים של אחרים</b><br />בנק מזרחי טפחות (20) · סניף כנפי נשרים (539)<br />חשבון: <b>497218</b></p>
          </div>
          <div className="dn-way">
            <h3>🌍 מחו"ל — PayPal</h3>
            <p>לתורמים מחוץ לישראל, מהיר ומאובטח.</p>
            <a className="dn-link" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">paypal.me/savingthedogs ←</a>
          </div>
        </div>
      </section>

      <section className="dn-more">
        <h2>עוד דרכים לעזור</h2>
        <div className="dn-more-grid">
          <Link to="/virtual-adoption" className="dn-more-card"><span>😇</span><b>המלאך השומר שלי</b><small>חסות חודשית לכלב אחד — עם עדכון ממנו כל חודש</small></Link>
          <Link to="/gift-adoption" className="dn-more-card"><span>🎁</span><b>אימוץ במתנה</b><small>מתנה עם משמעות לאדם שאתם אוהבים</small></Link>
          <a href={GROW_ITEMS} target="_blank" rel="noopener" className="dn-more-card"><span>🦴</span><b>תרומת ציוד</b><small>אוכל, מצעים וציוד לבתי המחסה</small></a>
          <Link to="/homes" className="dn-more-card"><span>🕯️</span><b>תרומה להנצחה</b><small>לזכר עדי, שני ויאיר ז"ל</small></Link>
        </div>
      </section>

      <Updates />
    </>
  )
}
