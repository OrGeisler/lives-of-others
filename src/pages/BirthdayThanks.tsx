import { focusStyle } from '../lib/focus'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../lib/lang'
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
  useTitle('איגרת תודה 🎂 — חיים של אחרים', 'Thank-you card 🎂 — Lives of Others')
  const { en, t, to, db } = useLang()
  // outside the site Layout: set the page language/direction here
  useEffect(() => { const h = document.documentElement; h.lang = en ? 'en' : 'he'; h.dir = en ? 'ltr' : 'rtl' }, [en])
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
            {dog?.main_image && <img className="ty-photo" src={dog.main_image} style={focusStyle(dog)} alt="" />}
            <h1>{t('תודה על המתנה! 🎁', 'Thank you for the gift! 🎁')}</h1>
            <p className="ty-to">{donor ? t(`ל${donor} היקרים,`, `Dear ${donor},`) : ''}</p>
            <p>{t('בזכותכם יום ההולדת שלי היה הכי שמח בבית המחסה! פינקתם אותי, ועשיתם לי את הלב (ואת הזנב 🐕) לכשכש בלי הפסקה.', 'Thanks to you, my birthday was the happiest at the shelter! You spoiled me, and made my heart (and my tail 🐕) wag non-stop.')}</p>
            <p>{t('ועכשיו אני כבר מחכה לכם — עם ליקוק גדול כשתבואו לבקר.', "And now I'm already waiting for you — with a big lick when you come to visit.")}</p>
            <div className="ty-sign">{t('באהבה,', 'With love,')} {dog && db(dog.name, dog.name_en)} <span className="ty-paw">🐾</span></div>
            <div className="ty-logo"><img src="/assets/img/logo.jpg" alt="" />{t('וכל המשפחה של עמותת חיים של אחרים', 'and the whole Lives of Others family')}</div>
          </div>
        </div>
        <div className="ty-actions">
          <button className="btn btn-gold" type="button" onClick={() => window.print()}>{t('⬇ הורדה / הדפסה', '⬇ Download / print')}</button>
          <Link className="btn btn-outline-green" to={to('/birthday')}>{t('חזרה לעמוד יום ההולדת', 'Back to the birthday page')}</Link>
        </div>
      </div>
    </div>
  )
}
