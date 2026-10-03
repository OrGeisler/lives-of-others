import { Link } from 'react-router-dom'
import VirtualAdoptionDetails from '../VirtualAdoptionDetails'

// Detailed virtual-adoption section on the home page (24.9 8.1)
export default function VirtualAdoptionHome() {
  return (
    <section id="sponsor" className="va-home">
      <div className="va-home-inner">
        <div className="va-home-head reveal">
          <h2 className="va-h1">
            בוא להיות המלאך השומר שלי{' '}
            <svg className="va-heart" viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M12 21s-7.5-4.9-10-9.3C.3 8.4 1.7 5 5 5c2 0 3.2 1.1 4 2.3C9.8 6.1 11 5 13 5c3.3 0 4.7 3.4 3 6.7C19.5 16.1 12 21 12 21z" /></svg>
            <span className="va-h1-sub">אימוץ וירטואלי</span>
          </h2>
          {/* תמונת חיבוק "אימוץ וירטואלי 6" — להוסיף כאן כשתישלח מהעמותה */}
          <p className="va-lead">לא כל אחד יכול לפתוח את הבית – אבל כל אחד יכול לפתוח את הלב.</p>
          <p>ישנם כלבים שהדרך שלהם לבית קבוע ארוכה יותר. חלקם נמצאים איתנו חודשים וחלקם אף שנים ארוכות. עבורם הקמנו את תוכנית "המלאך השומר שלי".</p>
          <p>זו הדרך שלכם להפוך למלאכים השומרים של כלב שזקוק לכם — לדעת שיש לכם חבר על ארבע שמחכה לכם וזוכה לחיים טובים בזכותכם.</p>
          <p>באימוץ וירטואלי אתם בוחרים כלב מסוים ומלווים אותו מקרוב בחסות חודשית קבועה, עד שימצא בית של ממש.</p>
        </div>
        <VirtualAdoptionDetails />
        <div className="va-home-cta reveal">
          <Link className="btn btn-angel" to="/virtual-adoption#choose"><span className="angel-l1">אני רוצה לאמץ וירטואלית עכשיו</span></Link>
          <Link to="/virtual-adoption" className="va-home-more">לעמוד האימוץ הווירטואלי המלא ←</Link>
        </div>
      </div>
    </section>
  )
}
