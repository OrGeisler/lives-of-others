import { Link } from 'react-router-dom'
import { FOOD_SACK_URL } from '../../lib/links'

// Home page "doors" — one inviting card per area of the site (pages split, 2026-10)
const DOORS = [
  { to: '/dogs', img: '/assets/img/dog-shuki-1.jpg', title: 'הכלבים שלנו', text: 'הכירו את הכלבים שמחכים לבית', tone: 'blue' },
  { to: '/virtual-adoption', img: '/assets/img/dog-cooper-1.jpg', title: 'המלאך השומר שלי', text: 'אימוץ וירטואלי — חסות חודשית לכלב', tone: 'pink' },
  { to: '/gift-adoption', img: '/assets/img/dog-micha-1.jpg', title: 'אימוץ במתנה 🎁', text: 'מתנה מרגשת עם משמעות', tone: 'rose' },
  { to: '/homes', img: '/assets/img/memorial-adi-leni.jpg', title: 'הבתים הקסומים', text: 'פרויקטי הנצחה שמצילים חיים', tone: 'navy' },
  { to: '/about', img: '/assets/img/tali-malinois.jpg', title: 'על העמותה והצוות', text: 'מי אנחנו ומה מייחד אותנו', tone: 'teal' },
  { to: '/volunteer', img: '/assets/img/volunteers.jpg', title: 'התנדבות', text: 'בואו להיות חלק מהמשפחה', tone: 'green' },
]

export default function Doors() {
  return (
    <section className="doors">
      <div className="wrap">
        <div className="section-head reveal"><h2>איך אפשר לעזור? 🐾</h2><p>בחרו את הדרך שלכם להיות חלק מהסיפור</p></div>
        <div className="doors-grid">
          {DOORS.map(d => (
            <Link key={d.to} to={d.to} className={`door door-${d.tone} reveal`}>
              <img src={d.img} alt="" loading="lazy" />
              <span className="door-body">
                <strong>{d.title}</strong>
                <span>{d.text}</span>
                <em aria-hidden="true">←</em>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// 26.10: "קיומנו תלוי בכם" band between the doors and the birthday section: one bold line and one big
// button shaped like a food sack (the nonprofit asked for a loud colour and a sack / bowl look).
export function FoodBand() {
  return (
    <section className="food-band">
      <div className="wrap food-band-inner reveal">
        <h2>קיומנו תלוי בכם</h2>
        <a className="food-sack" href={FOOD_SACK_URL} target="_blank" rel="noopener">
          <span className="food-sack-top" aria-hidden="true" />
          <span className="food-sack-body">
            <svg viewBox="0 0 64 40" aria-hidden="true"><path d="M4 18h56c0 12-12 20-28 20S4 30 4 18z" fill="#fff" opacity=".95"/><ellipse cx="32" cy="18" rx="28" ry="5" fill="#fff"/><circle cx="22" cy="14" r="4" fill="#8a5a2b"/><circle cx="32" cy="11" r="4.5" fill="#a26a35"/><circle cx="42" cy="14" r="4" fill="#8a5a2b"/><circle cx="27" cy="9" r="3.5" fill="#b97a3e"/><circle cx="37" cy="8" r="3.5" fill="#8a5a2b"/></svg>
            <b>לתרומת שק אוכל</b>
            <span className="food-sack-sum">180 ₪</span>
          </span>
        </a>
      </div>
    </section>
  )
}
