import { Link } from 'react-router-dom'
import GiftBox from '../GiftBox'

// 22.10: the gift banner (moved here from the virtual-adoption page), under "מדברים עלינו",
// in the festive style of the birthday page: gradient band, confetti, the dog popping out of a gift box.
export default function GiftHome() {
  return (
    <section className="gift-home">
      <span className="gh-confetti c1" aria-hidden="true" /><span className="gh-confetti c2" aria-hidden="true" />
      <span className="gh-confetti c3" aria-hidden="true" /><span className="gh-confetti c4" aria-hidden="true" />
      <div className="wrap gift-home-inner reveal">
        <GiftBox />
        <div className="gift-home-body">
          <span className="gift-home-tag">🎁 אימוץ במתנה</span>
          <h2>רוצה להעניק מתנה מרגשת <span>לאדם אהוב?</span></h2>
          <p>אימוץ וירטואלי של אחד הכלבים שהצלנו, במתנה. מקבל/ת המתנה יקבל/תקבל תעודת אימוץ, את הברכה שלכם ועדכונים מהכלב — והכלב יקבל אוכל, טיפול ואהבה.</p>
          <Link to="/gift-adoption" className="btn gift-home-btn">לאימוץ במתנה ←</Link>
        </div>
      </div>
    </section>
  )
}
