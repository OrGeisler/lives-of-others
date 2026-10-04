import { focusStyle } from '../lib/focus'
import { Link, useLocation } from 'react-router-dom'
import { GROW_VIRTUAL } from '../lib/links'
import { monthFromQuery, useBirthdayDogFor, useTitle } from '../lib/pagesData'
import '../styles/pages.css'

// Dog of the month comes from birthday_schedule (managed in the admin); ?month=1..12 previews another month.

const CONFETTI: [string, string, string, string][] = [
  // left, colour, duration, delay
  ['6%', '#ffe14d', '5.5s', '0s'], ['18%', '#E0678F', '6.5s', '1s'], ['30%', '#45BEC9', '5s', '.5s'],
  ['44%', '#7C5CBF', '7s', '2s'], ['58%', '#ffe14d', '6s', '.2s'], ['70%', '#E0678F', '5.2s', '1.5s'],
  ['82%', '#45BEC9', '6.8s', '.8s'], ['92%', '#7C5CBF', '5.6s', '2.2s'],
]

export function Confetti({ items = CONFETTI }: { items?: [string, string, string, string][] }) {
  return (
    <div className="confetti" aria-hidden="true">
      {items.map(([left, bg, dur, delay]) => (
        <i key={left} style={{ left, background: bg, animationDuration: dur, animationDelay: delay }} />
      ))}
    </div>
  )
}

const GIFTS = [
  { ico: '🎂', name: 'עוגת יום הולדת', price: '25 ₪', desc: 'חגיגה מתוקה וכשרה לכלבים' },
  { ico: '🦴', name: 'שק חטיפים', price: '40 ₪', desc: 'הפינוקים שהכי אוהבים' },
  { ico: '🧸', name: 'צעצוע חדש', price: '60 ₪', desc: 'שעות של שמחה ומשחק' },
  { ico: '🛁', name: 'יום פינוק וטיפוח', price: '120 ₪', desc: 'רחצה, סירוק והמון תשומת לב' },
  { ico: '🍗', name: 'ארוחת חג ללהקה', price: '200 ₪', desc: 'חוגגים עם כל הלהקה' },
  { ico: '🎈', name: 'מתנה בסכום חופשי', price: 'אתם בוחרים', desc: 'כל סכום — כל חיבוק חשוב' },
]

export default function Birthday() {
  useTitle('יום הולדת לכלב 🎂 — חיים של אחרים')
  const { search } = useLocation()
  const { dog, text, loading } = useBirthdayDogFor(monthFromQuery(search))
  const name = dog?.name ?? ''
  // the month's own text from the admin (ימי הולדת) wins; otherwise the first paragraph of the dog's story
  const story = text || (dog?.story?.split(/\n\s*\n/)[0] ?? '')
  if (loading) return <div style={{ minHeight: '70vh' }} />

  return (
    <>
      <section className="bd-hero">
        <Confetti />
        <div className="wrap">
          <Link className="bd-back" to="/">→ חזרה לעמוד הבית</Link>
          <h1>{dog ? <>🎂 ל<span className="bd-name">{name}</span> יש יום הולדת!</> : '🎂 חוגגים יום הולדת לכלבים שלנו!'}</h1>
          <p>כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו ההזדמנות שלכם לפנק אותו במתנה קטנה שתעשה לו את היום. בואו נחגוג יחד! 🎈</p>
        </div>
      </section>

      {dog && <section className="bd-dog reveal">
        {dog?.main_image && <img src={dog.main_image} style={focusStyle(dog)} alt={`${name} חוגג/ת יום הולדת`} />}
        <div>
          <span className="bd-badge">🎉 חוגג/ת החודש</span>
          <h2>בואו לחגוג עם {name}! 🥳</h2>
          <p className="bd-tagline">{dog?.tagline}</p>
          <p>{story}</p>
          <p>בואו נעשה ל{name} יום הולדת בלתי נשכח 💛</p>
        </div>
      </section>}

      <div className="bd-fact reveal">
        <div className="card">✨ <strong>ידעתם?</strong> גם מפורסמים אוהבים כלבים — מחקרים מראים שחיבוק לכלב משחרר אוקסיטוצין (הורמון האהבה) גם אצל האדם וגם אצל הכלב. אז מתנה ל{name} = קצת אושר גם לכם 🐾</div>
      </div>

      <section className="bd-menu-sec">
        <div className="bd-menu-inner">
          <div className="section-head reveal">
            <h2>מחירון מתנות יום ההולדת 🎁</h2>
            <p>בחרו מתנה ל{name} — ותקבלו איגרת תודה אישית מהכלב החוגג. <Link to="/birthday-thanks" style={{ color: '#E0678F', fontWeight: 700 }}>(הצצה לאיגרת)</Link></p>
          </div>
          <div className="bd-menu reveal">
            {GIFTS.map(g => (
              <a className="bd-gift" key={g.name} href={GROW_VIRTUAL} target="_blank" rel="noopener">
                <span className="bg-ico">{g.ico}</span><strong>{g.name}</strong>
                <span className="bg-price">{g.price}</span><span className="bg-desc">{g.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="bd-cta">
        <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto 4px' }}>רוצים ללוות כלב לאורך כל השנה, לא רק ביום ההולדת?</p>
        <Link className="btn btn-gold" to="/virtual-adoption">להיות המלאך השומר שלי — אימוץ וירטואלי ←</Link>
      </div>
    </>
  )
}
