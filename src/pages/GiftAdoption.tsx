import '../styles/checkout.css'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGiftDogs, useTitle } from '../lib/pagesData'
import type { Dog } from '../lib/types'
import '../styles/pages.css'

// First paragraph of the dog's story, as on the static gift page
const firstPara = (d: Dog) => d.story?.split(/\n\s*\n/)[0] ?? ''

export default function GiftAdoption() {
  useTitle('אימוץ במתנה — חיים של אחרים')
  const { dogs, error } = useGiftDogs()
  const [chosen, setChosen] = useState<Dog | null>(null)
  const payRef = useRef<HTMLButtonElement>(null)
  const nav = useNavigate()
  const [needPick, setNeedPick] = useState(false)

  const pick = (d: Dog) => {
    setChosen(d)
    payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <section className="gift-hero">
        <div className="wrap">
          <Link className="gift-back" to="/">→ חזרה לעמוד הבית</Link>
          <h1>אימוץ במתנה 🎁</h1>
          <div className="gh-text">
            <p className="sub">מחפשים מתנה מרגשת? מתנה עם משמעות? רוצים להפתיע אדם שאוהב כלבים?</p>
            <p>אנחנו מזמינים אתכם להעניק מתנה יוצאת דופן, לאדם קרוב - אימוץ וירטואלי של אחד מהכלבים המתוקים שהצלנו</p>
            <p>בזכות התרומה החד פעמית שלכם בסך 180 ₪, הכלב שבחרתם יזכה לכל מה שהוא צריך כדי להשתקם – קורת גג בטוחה, מזון איכותי, טיפול רפואי מסור וים של אהבה</p>
            <p>ככה תוכלו לדעת שהענקתם מתנה שלא תישכח ובו זמנית הענקתם את מתנת החיים לכלב שזקוק לכם יותר מכל</p>
          </div>
        </div>
      </section>

      <section className="gift-sec">
        <div className="section-head reveal"><h2>מה כוללת המתנה?</h2></div>
        <div className="gift-why reveal">
          <div className="gw">
            <div className="gw-ico"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="26" width="44" height="30" rx="3" /><rect x="6" y="18" width="52" height="10" rx="2" /><path d="M32 18v38" /><path d="M32 18c-4-10-16-12-16-4 0 4 8 4 16 4z" /><path d="M32 18c4-10 16-12 16-4 0 4-8 4-16 4z" /></svg></div>
            <h3>הפתעה מרגשת ישר לנייד</h3>
            <p>בתזמון המדוייק שתבחרו, נשלח לחוגג/ת הודעת אימוץ אישית ומרגשת בשמו של הכלב החדש שאימצתם עבורו. להודעה נצרף את הברכה האישית שלכם, כדי להפוך את הרגע לבלתי נשכח</p>
          </div>
          <div className="gw">
            <div className="gw-ico"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M30 40C22 24 10 20 4 22c4 4 4 12 10 16 4 3 10 3 16 2z" /><path d="M34 40c8-16 20-20 26-18-4 4-4 12-10 16-4 3-10 3-16 2z" /><path d="M32 30c-3-4-9-1-6 4l6 6 6-6c3-5-3-8-6-4z" /><path d="M20 12l2 3M44 12l-2 3M32 6v4" /></svg></div>
            <h3>עדכונים אישיים מהכלב</h3>
            <p>כמו בקשר קרוב ומרגש, מקבל המתנה יזכה לעדכון אישי מהכלב אחת לחודש למשך שנה שלמה</p>
          </div>
        </div>
      </section>

      <section className="gift-sec" style={{ paddingTop: 0 }}>
        <h2 className="pick-title reveal">לחצו על התמונה של הכלב שאותו תרצו לבחור כאימוץ במתנה</h2>
        {error && <p>שגיאה בטעינת הכלבים: {error}</p>}
        <div className="gift-dogs2">
          {dogs?.map(d => {
            const on = chosen?.id === d.id
            return (
              <article className={`gdog${on ? ' on' : ''}`} key={d.id}>
                {d.main_image && <img src={d.main_image} alt={d.name} loading="lazy" onClick={() => pick(d)} />}
                <div className="gdog-body">
                  <h3>{d.name}</h3>
                  <span className="gdog-age">{d.age_text}</span>
                  <span className="gdog-tag">{d.tagline}</span>
                  <p>{firstPara(d)}</p>
                  <button className="gdog-pick" type="button" onClick={() => pick(d)}>{on ? '✓ נבחרתי!' : 'בחרו אותי'}</button>
                </div>
              </article>
            )
          })}
        </div>

        {/* → /checkout: buyer + recipient details, send date and greeting; payment on Grow (in-page once the Grow API is connected) */}
        <div className="gift-pay reveal">
          <span className="gb-chosen">{chosen ? `🎁 בחרתם במתנה את ${chosen.name}` : ''}</span>
          <button type="button" className="gift-box-big" ref={payRef} onClick={() => chosen ? nav(`/checkout?type=gift&dog=${chosen.slug}`) : setNeedPick(true)}>
            <span className="lid" />
            <span className="box"><span>לתשלום 180 ₪ במתנה</span><small>תרומה חד-פעמית</small></span>
          </button>
          {needPick && !chosen && <span className="gb-need" role="alert">☝️ קודם בחרו כלב — לחצו "בחרו אותי" על אחד הכלבים</span>}
        </div>
      </section>
    </>
  )
}
