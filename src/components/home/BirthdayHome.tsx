import { Link } from 'react-router-dom'
import { focusStyle } from '../../lib/focus'
import { useBirthdayDog } from '../../lib/data'
import { useLang } from '../../lib/lang'

// Birthday of the month — the dog comes from birthday_schedule for the current month (24.9).
// Deliberately calm design (feedback 5.10: the gradient + confetti looked "AI"): a clean card in the site's palette.
export default function BirthdayHome() {
  const { data } = useBirthdayDog()
  const dog = data?.dogs
  const { en, t, to, db, arrow } = useLang()
  if (!dog || dog.active === false) return null
  return (
    <section className="bday-home">
      <div className="bday-card reveal">
        {dog.main_image && (
          <div className="bday-photo">
            <img src={dog.main_image} style={focusStyle(dog)} alt={t(`${dog.name} חוגג/ת יום הולדת`, `${db(dog.name, dog.name_en)}'s birthday`)} />
          </div>
        )}
        <div className="bday-body">
          <span className="bday-tag">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M5 21v-8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 12V8M12 5.5c.8-.9.8-2 0-3-.8 1-.8 2.1 0 3z" /></svg>
            {t('יום הולדת החודש', "This month's birthday")}
          </span>
          {en ? <h2>It's <span>{db(dog.name, dog.name_en)}</span>'s birthday!</h2> : <h2>ל<span>{dog.name}</span> יש יום הולדת</h2>}
          <p>{t('כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו הזדמנות לפנק אותו במתנה קטנה שתעשה לו את היום.', 'Every month another dog at the shelter celebrates a birthday — and it\'s your chance to spoil them with a small gift that will make their day.')}</p>
          <Link to={to('/birthday')} className="btn bday-btn">{t(`למתנת יום הולדת ל${dog.name}`, `Send ${db(dog.name, dog.name_en)} a birthday gift`)} {arrow}</Link>
        </div>
      </div>
    </section>
  )
}
