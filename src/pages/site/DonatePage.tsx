import { useCounters } from '../../lib/data'
import { DONATE_URL, WA_TALI, wa } from '../../lib/links'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import '../../styles/donate.css'

// Faces framed by eye (same set as the Grow cover)
const DOGS: [string, string][] = [
  ['/assets/img/dog-shuki-1.jpg', '50% 18%'], ['/assets/img/dog-micha-1.jpg', '50% 25%'], ['/assets/img/dog-pil-1.jpg', '50% 12%'],
  ['/assets/img/dog-gili-2.jpg', '50% 25%'], ['/assets/img/dog-bella-3.jpg', '50% 22%'],
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
          <p>מאחורי כל זוג עיניים כאן יש סיפור של נטישה — ושל הצלה. התרומה שלכם היא האוכל, הטיפול והבית שלהם, כל יום מחדש.</p>
          <div className="dn-cta">
            <a className="btn dn-main" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מאובטחת ❤</a>
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

      <section className="dn-ways">
        <h2>כל הדרכים לתרום</h2>
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
          <div className="dn-way">
            <h3>💵 מזומן / המחאה</h3>
            <p>לתרומה במזומן או בהמחאה צרו קשר עם טלי: <b dir="ltr">054-6881116</b></p>
            <a className="dn-link" href={wa(WA_TALI, 'היי טלי, אני רוצה לתרום במזומן / בהמחאה לעמותת חיים של אחרים')} target="_blank" rel="noopener">לשיחה עם טלי בוואטסאפ ←</a>
          </div>
        </div>
      </section>

    </>
  )
}
