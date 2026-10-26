import { Link } from 'react-router-dom'
import { FOOD_SACK_URL } from '../../lib/links'
import { useLang } from '../../lib/lang'

// Home page "doors" — one inviting card per area of the site (pages split, 2026-10)
const DOORS = [
  { to: '/dogs', img: '/assets/img/dog-shuki-1.jpg', title: 'הכלבים שלנו', text: 'הכירו את הכלבים שמחכים לבית', en: ['Our dogs', 'Meet the dogs waiting for a home'], tone: 'blue' },
  { to: '/virtual-adoption', img: '/assets/img/dog-cooper-1.jpg', title: 'המלאך השומר שלי', text: 'אימוץ וירטואלי — חסות חודשית לכלב', en: ['My guardian angel', 'Virtual adoption — a monthly sponsorship for a dog'], tone: 'pink' },
  { to: '/gift-adoption', img: '/assets/img/dog-micha-1.jpg', title: 'אימוץ במתנה 🎁', text: 'מתנה מרגשת עם משמעות', en: ['Adopt as a gift 🎁', 'A moving gift with meaning'], tone: 'rose' },
  { to: '/homes', img: '/assets/img/memorial-adi-leni.jpg', title: 'הבתים הקסומים', text: 'פרויקטי הנצחה שמצילים חיים', en: ['The Magical Homes', 'Memorial projects that save lives'], tone: 'navy' },
  { to: '/about', img: '/assets/img/tali-malinois.jpg', title: 'על העמותה והצוות', text: 'מי אנחנו ומה מייחד אותנו', en: ['About us and our team', 'Who we are and what makes us different'], tone: 'teal' },
  { to: '/volunteer', img: '/assets/img/volunteers.jpg', title: 'התנדבות', text: 'בואו להיות חלק מהמשפחה', en: ['Volunteer', 'Come be part of the family'], tone: 'green' },
]

export default function Doors() {
  const { en, t, to, arrow } = useLang()
  return (
    <section className="doors">
      <div className="wrap">
        <div className="section-head reveal"><h2>{t('איך אפשר לעזור? 🐾', 'How can you help? 🐾')}</h2><p>{t('בחרו את הדרך שלכם להיות חלק מהסיפור', 'Choose your way to be part of the story')}</p></div>
        <div className="doors-grid">
          {DOORS.map(d => (
            <Link key={d.to} to={to(d.to)} className={`door door-${d.tone} reveal`}>
              <img src={d.img} alt="" loading="lazy" />
              <span className="door-body">
                <strong>{en ? d.en[0] : d.title}</strong>
                <span>{en ? d.en[1] : d.text}</span>
                <em aria-hidden="true">{arrow}</em>
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
  const { t } = useLang()
  return (
    <section className="food-band">
      <div className="wrap food-band-inner reveal">
        <h2>{t('קיומנו תלוי בכם', 'We exist thanks to you')}</h2>
        <a className="food-sack" href={FOOD_SACK_URL} target="_blank" rel="noopener">
          <span className="food-sack-top" aria-hidden="true" />
          <span className="food-sack-body">
            <svg viewBox="0 0 64 40" aria-hidden="true"><path d="M4 18h56c0 12-12 20-28 20S4 30 4 18z" fill="#fff" opacity=".95"/><ellipse cx="32" cy="18" rx="28" ry="5" fill="#fff"/><circle cx="22" cy="14" r="4" fill="#8a5a2b"/><circle cx="32" cy="11" r="4.5" fill="#a26a35"/><circle cx="42" cy="14" r="4" fill="#8a5a2b"/><circle cx="27" cy="9" r="3.5" fill="#b97a3e"/><circle cx="37" cy="8" r="3.5" fill="#8a5a2b"/></svg>
            <b>{t('לתרומת שק אוכל', 'Donate a sack of food')}</b>
            <span className="food-sack-sum">{t('180 ₪', '₪180')}</span>
          </span>
        </a>
      </div>
    </section>
  )
}
