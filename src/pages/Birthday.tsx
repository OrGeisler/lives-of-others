import { focusStyle } from '../lib/focus'
import { Link, useLocation } from 'react-router-dom'
import { isTestMode } from '../lib/links'
import { usePayLinks } from '../lib/useLinks'
import { monthFromQuery, useBirthdayDogFor, useTitle } from '../lib/pagesData'
import '../styles/pages.css'
import { useLang } from '../lib/lang'

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
  { ico: '🎂', name: 'עוגת יום הולדת', price: '25 ₪', desc: 'חגיגה מתוקה וכשרה לכלבים', en: ['Birthday cake', '₪25', 'A sweet, dog-safe celebration'] },
  { ico: '🦴', name: 'שק חטיפים', price: '40 ₪', desc: 'הפינוקים שהכי אוהבים', en: ['A bag of treats', '₪40', 'The treats they love most'] },
  { ico: '🧸', name: 'צעצוע חדש', price: '60 ₪', desc: 'שעות של שמחה ומשחק', en: ['A new toy', '₪60', 'Hours of joy and play'] },
  { ico: '🛁', name: 'יום פינוק וטיפוח', price: '120 ₪', desc: 'רחצה, סירוק והמון תשומת לב', en: ['A pampering day', '₪120', 'A bath, a brush and lots of attention'] },
  { ico: '🍗', name: 'ארוחת חג ללהקה', price: '200 ₪', desc: 'חוגגים עם כל הלהקה', en: ['A feast for the pack', '₪200', 'Celebrating with the whole pack'] },
  { ico: '🎈', name: 'מתנה בסכום חופשי', price: 'אתם בוחרים', desc: 'כל סכום — כל חיבוק חשוב', en: ['Any amount', 'You choose', 'Any amount — every hug counts'] },
]

export default function Birthday() {
  useTitle('יום הולדת לכלב 🎂 — חיים של אחרים', "A dog's birthday 🎂 — Lives of Others")
  const { en, t, to, db, arrow } = useLang()
  const { search } = useLocation()
  const { dog, text, loading } = useBirthdayDogFor(monthFromQuery(search))
  const pay = usePayLinks()
  const name = dog ? db(dog.name, dog.name_en) : ''
  // the month's own text from the admin (ימי הולדת, Hebrew only) wins; otherwise the first paragraph of the dog's story
  const story = (!en && text) || (db(dog?.story, dog?.story_en).split(/\n\s*\n/)[0] ?? '')
  if (loading) return <div style={{ minHeight: '70vh' }} />

  return (
    <>
      <section className="bd-hero">
        <Confetti />
        <div className="wrap">
          <Link className="bd-back" to={to('/')}>{t('→ חזרה לעמוד הבית', '← Back to the home page')}</Link>
          <h1>{dog
            ? (en ? <>🎂 It's <span className="bd-name">{name}</span>'s birthday!</> : <>🎂 ל<span className="bd-name">{name}</span> יש יום הולדת!</>)
            : t('🎂 חוגגים יום הולדת לכלבים שלנו!', "🎂 Celebrating our dogs' birthdays!")}</h1>
          <p>{t('כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו ההזדמנות שלכם לפנק אותו במתנה קטנה שתעשה לו את היום. בואו נחגוג יחד! 🎈', "Every month another dog at the shelter celebrates a birthday — and it's your chance to spoil them with a small gift that will make their day. Let's celebrate together! 🎈")}</p>
        </div>
      </section>

      {dog && <section className="bd-dog reveal">
        {dog?.main_image && <img src={dog.main_image} style={focusStyle(dog)} alt={t(`${name} חוגג/ת יום הולדת`, `${name}'s birthday`)} />}
        <div>
          <span className="bd-badge">{t('🎉 חוגג/ת החודש', "🎉 This month's birthday")}</span>
          <h2>{t(`בואו לחגוג עם ${name}! 🥳`, `Come celebrate with ${name}! 🥳`)}</h2>
          <p className="bd-tagline">{db(dog?.tagline, dog?.tagline_en)}</p>
          <p>{story}</p>
          <p>{t(`בואו נעשה ל${name} יום הולדת בלתי נשכח 💛`, `Let's give ${name} an unforgettable birthday 💛`)}</p>
        </div>
      </section>}

      <div className="bd-fact reveal">
        <div className="card">✨ {en
          ? <><strong>Did you know?</strong> Studies show that hugging a dog releases oxytocin (the love hormone) in both the person and the dog. So a gift for {name || 'our dogs'} = a little happiness for you too 🐾</>
          : <><strong>הידעתם?</strong> מחקרים מראים שחיבוק לכלב משחרר אוקסיטוצין (הורמון האהבה) גם אצל האדם וגם אצל הכלב. אז מתנה ל{name} = קצת אושר גם לכם 🐾</>}</div>
      </div>

      <section className="bd-menu-sec">
        <div className="bd-menu-inner">
          <div className="section-head reveal">
            <h2>{t('מחירון מתנות יום ההולדת 🎁', 'Birthday gift menu 🎁')}</h2>
            <p>{t(`בחרו מתנה ל${name} — ותקבלו איגרת תודה אישית מהכלב החוגג.`, `Choose a gift for ${name || 'the birthday dog'} — and get a personal thank-you card from the birthday dog.`)} <Link to={to('/birthday-thanks')} style={{ color: '#E0678F', fontWeight: 700 }}>{t('(הצצה לאיגרת)', '(see the card)')}</Link></p>
          </div>
          <div className="bd-menu reveal">
            {GIFTS.map(g => (
              <a className="bd-gift" key={g.name} href={isTestMode() ? pay.grow_test : pay.grow_birthday} target="_blank" rel="noopener">
                <span className="bg-ico">{g.ico}</span><strong>{en ? g.en[0] : g.name}</strong>
                <span className="bg-price">{en ? g.en[1] : g.price}</span><span className="bg-desc">{en ? g.en[2] : g.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="bd-cta">
        <p style={{ color: 'var(--muted)', maxWidth: 600, margin: '0 auto 4px' }}>{t('רוצים ללוות כלב לאורך כל השנה, לא רק ביום ההולדת?', 'Want to accompany a dog all year round, not just on their birthday?')}</p>
        <Link className="btn btn-gold" to={to('/virtual-adoption')}>{t('להיות המלאך השומר שלי — אימוץ וירטואלי', 'Be my guardian angel — virtual adoption')} {arrow}</Link>
      </div>
    </>
  )
}
