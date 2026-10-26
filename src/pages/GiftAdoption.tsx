import { focusStyle } from '../lib/focus'
import '../styles/checkout.css'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGiftDogs, useTitle } from '../lib/pagesData'
import type { Dog } from '../lib/types'
import { ageLabel, ageLabelEn } from '../lib/dogAge'
import { useLang } from '../lib/lang'
import '../styles/pages.css'
import GiftBox from '../components/GiftBox'

// First paragraph of the dog's story, as on the static gift page
const paras = (s: string) => s.split(/\n\s*\n/).filter(Boolean)

export default function GiftAdoption() {
  useTitle('אימוץ במתנה — חיים של אחרים', 'Adopt as a gift — Lives of Others')
  const { en, t, to, db } = useLang()
  const story = (d: Dog) => paras(db(d.story, d.story_en))
  const age = (d: Dog) => (en ? ageLabelEn(d) : ageLabel(d))
  const { dogs, error } = useGiftDogs()
  const [chosen, setChosen] = useState<Dog | null>(null)
  const payRef = useRef<HTMLButtonElement>(null)
  const nav = useNavigate()
  const [needPick, setNeedPick] = useState(false)
  const [open, setOpen] = useState<Set<string>>(new Set())

  const pick = (d: Dog) => {
    setChosen(d)
    payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <section className="gift-hero">
        <div className="wrap">
          <Link className="gift-back" to={to('/')}>{t('→ חזרה לעמוד הבית', '← Back to the home page')}</Link>
          <h1>{t('אימוץ במתנה 🎁', 'Adopt as a gift 🎁')}</h1>
          <div className="gh-row">
          <GiftBox alt={t('כלב קופץ מתוך קופסת מתנה', 'A dog popping out of a gift box')} />
          <div className="gh-text">
            <p className="sub">{t('מחפשים מתנה מרגשת? מתנה עם משמעות? רוצים להפתיע אדם שאוהב כלבים?', 'Looking for a moving gift? A gift with meaning? Want to surprise someone who loves dogs?')}</p>
            <p>{t('אנחנו מזמינים אתכם להעניק מתנה יוצאת דופן, לאדם קרוב - אימוץ וירטואלי של אחד מהכלבים המתוקים שהצלנו', 'We invite you to give an extraordinary gift to someone close to you — a virtual adoption of one of the sweet dogs we rescued')}</p>
            <p>{t('בזכות התרומה החד פעמית שלכם בסך 180 ₪, הכלב שבחרתם יזכה לכל מה שהוא צריך כדי להשתקם – קורת גג בטוחה, מזון איכותי, טיפול רפואי מסור וים של אהבה', 'Thanks to your one-time donation of ₪180, the dog you choose gets everything they need to recover — a safe roof, quality food, devoted medical care and an ocean of love')}</p>
            <p>{t('ככה תוכלו לדעת שהענקתם מתנה שלא תישכח ובו זמנית הענקתם את מתנת החיים לכלב שזקוק לכם יותר מכל', "That way you'll know you gave a gift that won't be forgotten — and at the same time gave the gift of life to a dog who needs you more than anything")}</p>
          </div>
          </div>
        </div>
      </section>

      <section className="gift-sec">
        <div className="section-head reveal"><h2>{t('מה כוללת המתנה?', "What's in the gift?")}</h2></div>
        <div className="gift-why reveal">
          <div className="gw">
            <div className="gw-ico"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="26" width="44" height="30" rx="3" /><rect x="6" y="18" width="52" height="10" rx="2" /><path d="M32 18v38" /><path d="M32 18c-4-10-16-12-16-4 0 4 8 4 16 4z" /><path d="M32 18c4-10 16-12 16-4 0 4-8 4-16 4z" /></svg></div>
            <h3>{t('הפתעה מרגשת ישר לנייד', 'A moving surprise straight to their phone')}</h3>
            <p>{t('בתזמון המדוייק שתבחרו, נשלח לחוגג/ת הודעת אימוץ אישית ומרגשת בשמו של הכלב החדש שאימצתם עבורו. להודעה נצרף את הברכה האישית שלכם, כדי להפוך את הרגע לבלתי נשכח', 'At exactly the time you choose, we send them a personal, moving adoption message in the name of the new dog you adopted for them. We attach your personal greeting, to make the moment unforgettable')}</p>
          </div>
          <div className="gw">
            <div className="gw-ico"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M30 40C22 24 10 20 4 22c4 4 4 12 10 16 4 3 10 3 16 2z" /><path d="M34 40c8-16 20-20 26-18-4 4-4 12-10 16-4 3-10 3-16 2z" /><path d="M32 30c-3-4-9-1-6 4l6 6 6-6c3-5-3-8-6-4z" /><path d="M20 12l2 3M44 12l-2 3M32 6v4" /></svg></div>
            <h3>{t('עדכונים אישיים מהכלב', 'Personal updates from the dog')}</h3>
            <p>{t('כמו בקשר קרוב ומרגש, מקבל המתנה יזכה לעדכון אישי מהכלב אחת לחודש למשך שנה שלמה', 'Like a close, moving friendship: the person receiving the gift gets a personal update from the dog once a month, for a whole year')}</p>
          </div>
        </div>
      </section>

      <section className="gift-sec" style={{ paddingTop: 0 }}>
        <h2 className="pick-title reveal">{t('לחצו על התמונה של הכלב שאותו תרצו לבחור כאימוץ במתנה', "Click the photo of the dog you'd like to give as a gift")}</h2>
        {error && <p>{t('שגיאה בטעינת הכלבים:', 'Error loading the dogs:')} {error}</p>}
        <div className="gift-dogs2">
          {dogs?.map(d => {
            const on = chosen?.id === d.id
            return (
              <article className={`gdog${on ? ' on' : ''}`} key={d.id}>
                {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={db(d.name, d.name_en)} loading="lazy" onClick={() => pick(d)} />}
                <div className="gdog-body">
                  <h3>{db(d.name, d.name_en)}</h3>
                  <span className="gdog-tag">{db(d.tagline, d.tagline_en)}</span>
                  <p>{story(d)[0] ?? ''}</p>
                  {open.has(d.id)
                    ? <>{story(d).slice(1).map((p, i) => <p key={i}>{p}</p>)}{age(d) && <p className="dog-age-end">🐾 {db(d.name, d.name_en)}{en ? ', ' : ' '}{age(d)}</p>}</>
                    : <button className="gdog-more" type="button" onClick={() => setOpen(o => new Set(o).add(d.id))}>{t('רוצה להכיר אותי יותר? ↓', 'Want to know me better? ↓')}</button>}
                  <button className="gdog-pick" type="button" onClick={() => pick(d)}>{on ? t('✓ נבחרתי!', '✓ Chosen!') : t('בחרו אותי', 'Choose me')}</button>
                </div>
              </article>
            )
          })}
        </div>

        {/* → /checkout: buyer + recipient details, send date and greeting; payment on Grow (in-page once the Grow API is connected) */}
        <div className="gift-pay reveal">
          <span className="gb-chosen">{chosen ? t(`🎁 בחרתם במתנה את ${chosen.name}`, `🎁 You chose ${db(chosen.name, chosen.name_en)} as the gift`) : ''}</span>
          <button type="button" className="gift-box-big" ref={payRef} onClick={() => chosen ? nav(to(`/checkout?type=gift&dog=${chosen.slug}`)) : setNeedPick(true)}>
            <span className="lid" />
            <span className="box"><span>{t('לתשלום 180 ₪ במתנה', 'Pay ₪180 for the gift')}</span><small>{t('תרומה חד-פעמית', 'One-time donation')}</small></span>
          </button>
          {needPick && !chosen && <span className="gb-need" role="alert">{t('☝️ קודם בחרו כלב — לחצו "בחרו אותי" על אחד הכלבים', '☝️ First choose a dog — tap "Choose me" on one of the dogs')}</span>}
        </div>
      </section>
    </>
  )
}
