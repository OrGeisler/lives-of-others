import { Link } from 'react-router-dom'
import { useBirthdayDog } from '../../lib/data'

const CONFETTI: [string, string, string, string][] = [
  ['5%', '#ffe14d', '6s', '0s'], ['17%', '#fff', '7s', '1.2s'], ['29%', '#45BEC9', '5.4s', '.4s'], ['41%', '#ffe14d', '6.6s', '2s'],
  ['55%', '#fff', '5.8s', '.9s'], ['67%', '#45BEC9', '6.9s', '1.7s'], ['79%', '#ffe14d', '5.2s', '.2s'], ['91%', '#fff', '6.3s', '2.4s'],
]

// Birthday of the month — the dog comes from birthday_schedule for the current month (24.9)
export default function BirthdayHome() {
  const { data } = useBirthdayDog()
  const dog = data?.dogs
  if (!dog || dog.active === false) return null
  return (
    <section className="bday-home">
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map(([left, background, animationDuration, animationDelay]) => (
          <i key={left} style={{ left, background, animationDuration, animationDelay }}></i>
        ))}
      </div>
      <div className="dom-inner reveal">
        {dog.main_image && <img src={dog.main_image} alt={`${dog.name} חוגג/ת יום הולדת`} />}
        <div className="dom-body">
          <span className="dom-tag">🎂 יום הולדת החודש</span>
          <h2>ל<span>{dog.name}</span> יש יום הולדת! 🎉</h2>
          <p>כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו ההזדמנות שלכם לפנק אותו במתנה קטנה שתעשה לו את היום. בואו נחגוג יחד! 🎈</p>
          <div className="cta-row">
            <Link to="/birthday" className="btn bday-btn">לחגוג עם <span>{dog.name}</span> — מתנת יום הולדת ←</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
