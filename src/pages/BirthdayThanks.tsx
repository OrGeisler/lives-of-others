import { Link, useLocation } from 'react-router-dom'
import { monthFromQuery, useBirthdayDogFor, useTitle } from '../lib/pagesData'
import { Confetti } from './Birthday'
import '../styles/pages.css'

// Draft thank-you card for a birthday gift (24.9). Standalone page — route it OUTSIDE the site Layout.
// ?name=donor name  ?dog=slug (default: this month's birthday dog)  ?month=1..12

const CARD_CONFETTI: [string, string, string, string][] = [
  ['6%', '#ffe14d', '6s', '0s'], ['22%', '#fff', '6s', '1.4s'], ['38%', '#45BEC9', '6s', '.6s'],
  ['62%', '#ffe14d', '6s', '2s'], ['78%', '#fff', '6s', '.3s'], ['92%', '#45BEC9', '6s', '1.1s'],
]

export default function BirthdayThanks() {
  useTitle('איגרת תודה 🎂 — חיים של אחרים')
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const donor = (params.get('name') ?? '').trim().slice(0, 40)
  const { dog } = useBirthdayDogFor(monthFromQuery(search), params.get('dog'))

  return (
    <div className="ty-page">
      <div className="ty-wrap">
        <div className="ty-card">
          <Confetti items={CARD_CONFETTI} />
          <div className="ty-inner">
            <span className="ty-hat" aria-hidden="true">🥳</span>
            {dog?.main_image && <img className="ty-photo" src={dog.main_image} alt="" />}
            <h1>תודה על המתנה! 🎁</h1>
            <p className="ty-to">{donor ? `ל${donor} היקרים,` : ''}</p>
            <p>בזכותכם יום ההולדת שלי היה הכי שמח בבית המחסה! פינקתם אותי, ועשיתם לי את הלב (ואת הזנב 🐕) לכשכש בלי הפסקה.</p>
            <p>ועכשיו אני כבר מחכה לכם — עם ליקוק גדול כשתבואו לבקר.</p>
            <div className="ty-sign">באהבה, {dog?.name} <span className="ty-paw">🐾</span></div>
            <div className="ty-logo"><img src="/assets/img/logo.jpg" alt="" />וכל המשפחה של עמותת חיים של אחרים</div>
          </div>
        </div>
        <div className="ty-actions">
          <button className="btn btn-gold" type="button" onClick={() => window.print()}>⬇ הורדה / הדפסה</button>
          <Link className="btn btn-outline-green" to="/birthday">חזרה לעמוד יום ההולדת</Link>
        </div>
      </div>
    </div>
  )
}
