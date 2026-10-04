import { Link } from 'react-router-dom'

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

// Slim closing band: donate + contact
export function CtaBand() {
  return (
    <section className="cta-band">
      <div className="wrap cta-band-inner reveal">
        <p><strong>קיומנו תלוי בכם.</strong> כל תרומה, כל שיתוף וכל שעת התנדבות מצילים חיים.</p>
        <div className="cta-row">
          <Link to="/donate" className="btn btn-gold">לתרומה ←</Link>
          <Link to="/contact" className="btn btn-outline-green">צור קשר</Link>
        </div>
      </div>
    </section>
  )
}
