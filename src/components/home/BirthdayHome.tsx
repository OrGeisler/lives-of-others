import { Link } from 'react-router-dom'
import { focusStyle } from '../../lib/focus'
import { useBirthdayDog } from '../../lib/data'

// Birthday of the month — the dog comes from birthday_schedule for the current month (24.9).
// Deliberately calm design (feedback 5.10: the gradient + confetti looked "AI"): a clean card in the site's palette.
export default function BirthdayHome() {
  const { data } = useBirthdayDog()
  const dog = data?.dogs
  if (!dog || dog.active === false) return null
  return (
    <section className="bday-home">
      <div className="bday-card reveal">
        {dog.main_image && (
          <div className="bday-photo">
            <img src={dog.main_image} style={focusStyle(dog)} alt={`${dog.name} חוגג/ת יום הולדת`} />
          </div>
        )}
        <div className="bday-body">
          <span className="bday-tag">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 21h16M5 21v-8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 12V8M12 5.5c.8-.9.8-2 0-3-.8 1-.8 2.1 0 3z" /></svg>
            יום הולדת החודש
          </span>
          <h2>ל<span>{dog.name}</span> יש יום הולדת</h2>
          <p>כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו הזדמנות לפנק אותו במתנה קטנה שתעשה לו את היום.</p>
          <Link to="/birthday" className="btn bday-btn">למתנת יום הולדת ל{dog.name} ←</Link>
        </div>
      </div>
    </section>
  )
}
