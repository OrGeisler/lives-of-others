import { sized } from '../../lib/img'
import { Link } from 'react-router-dom'
import { FOOD_SACK_URL } from '../../lib/links'
import { usePayLinks } from '../../lib/useLinks'
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
              <img {...sized(d.img)} alt="" loading="lazy" />
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

// "קיומנו תלוי בכם" band between the doors and the birthday section. 2.11: a real food-sack picture (the CSS sack
// wasn't clear) and the site's teal/navy instead of orange. The link is editable in admin (קישורי תשלום), Hebrew and English.
export function FoodBand() {
  const { en, t } = useLang()
  const links = usePayLinks()
  const href = (en && links.grow_food_en) || links.grow_food || FOOD_SACK_URL
  return (
    <section className="food-band">
      <div className="wrap food-band-inner reveal">
        <img className="food-sack-img" src="/assets/img/food-sack.webp" width="464" height="700" loading="lazy" alt={t('שק אוכל לכלבים', 'A sack of dog food')} />
        <div className="food-band-text">
          <h2>{t('קיומנו תלוי בכם', 'We exist thanks to you')}</h2>
          <a className="food-sack-btn" href={href} target="_blank" rel="noopener">
            {t('לתרומת שק אוכל', 'Donate a sack of food')} <span className="food-sack-sum">{t('180 ₪', '₪180')}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
