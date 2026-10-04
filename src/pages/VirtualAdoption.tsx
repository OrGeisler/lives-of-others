import { focusStyle } from '../lib/focus'
import { Link } from 'react-router-dom'
import { VaAccordions, VaTiers } from '../components/VirtualAdoptionDetails'
import { WA_ADOPT, wa } from '../lib/links'
import { useVirtualDogs } from '../lib/checkout'
import { WAZE_SHELTER } from '../lib/constants'
import '../styles/checkout.css'
import { useTitle } from '../lib/pagesData'
import '../styles/pages.css'


export default function VirtualAdoption() {
  const vdogs = useVirtualDogs()
  useTitle('אימוץ וירטואלי — חיים של אחרים')
  return (
    <>
      <section className="va-hero">
        <div className="wrap">
          <Link className="va-back" to="/dogs">→ חזרה לכלבים</Link>
          <h1 className="va-h1">
            בוא להיות המלאך השומר שלי{' '}
            <svg className="va-heart" viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M12 21s-7.5-4.9-10-9.3C.3 8.4 1.7 5 5 5c2 0 3.2 1.1 4 2.3C9.8 6.1 11 5 13 5c3.3 0 4.7 3.4 3 6.7C19.5 16.1 12 21 12 21z" /></svg>
            <span className="va-h1-sub">אימוץ וירטואלי</span>
          </h1>
          {/* תמונת חיבוק (אימוץ וירטואלי 6) — להוסיף כאן כשתישלח מהעמותה */}
          <p className="va-lead">לא כל אחד יכול לפתוח את הבית – אבל כל אחד יכול לפתוח את הלב.</p>
          <p>ישנם כלבים שהדרך שלהם לבית קבוע ארוכה יותר. חלקם נמצאים איתנו חודשים וחלקם אף שנים ארוכות. עבורם הקמנו את תוכנית "המלאך השומר שלי".</p>
          <p>זו הדרך שלכם להפוך למלאכים השומרים של כלב שזקוק לכם — לדעת שיש לכם חבר על ארבע שמחכה לכם וזוכה לחיים טובים בזכותכם.</p>
          <p>באימוץ וירטואלי אתם בוחרים כלב מסוים ומלווים אותו מקרוב בחסות חודשית קבועה, עד שימצא בית של ממש.</p>
        </div>
      </section>

      <section className="va-section">
        <VaAccordions />

        <div className="section-head reveal" style={{ margin: '48px 0 26px' }}>
          <h2>מסלולי החסות החודשית</h2>
          <p>חסות חודשית קבועה (הוראת קבע). אתם בוחרים כלב — ומלווים אותו מדי חודש, עד שימצא בית.</p>
        </div>
        <VaTiers />

        <div className="va-note reveal">
          <span className="va-note-ic">🤝</span>
          <p><strong>שקיפות מלאה:</strong> הכלב שאתם מלווים נשאר אצלנו בבית המחסה ומקבל אוכל, חיסונים וטיפול. לפעמים כמה אנשים מלווים יחד את אותו כלב — וזה בדיוק הכוח של הקהילה. כל שקל הולך ישירות לטיפול בכלבים שלנו.</p>
        </div>

        {/* 24.9 (לדיון): בעתיד — גלריית כלבים שמובילה לעמוד אימוץ וירטואלי אישי לכל כלב, במקום הכפתור */}
        {/* 24.9 item 8: a gallery of the dogs — each opens its own virtual-adoption page */}
        <div id="choose" className="section-head reveal" style={{ margin: '44px 0 18px' }}>
          <h2>בחרו את הכלב שתרצו ללוות 🐾</h2>
          <p>לחצו על כלב כדי להכיר אותו ולבחור מסלול</p>
        </div>
        <div className="va-gallery">
          {vdogs?.map(d => (
            <Link key={d.id} to={`/virtual-adoption/${d.slug}`} className="va-gdog reveal">
              {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={d.name} loading="lazy" />}
              <span className="va-gdog-body"><b>{d.name}</b><span>{d.tagline}</span><em>לאמץ וירטואלית ←</em></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="va-gift">
        <div className="va-gift-inner" style={{ textAlign: 'center' }}>
          <div className="section-head reveal"><h2>רוצים להעניק את זה במתנה? 🎁</h2><p>אימוץ וירטואלי של אחד הכלבים שלנו — מתנה מרגשת עם משמעות.</p></div>
          <Link className="btn btn-gold" to="/gift-adoption">לאימוץ במתנה ←</Link>
        </div>
      </section>

      <section className="va-visit">
        <div className="va-visit-inner">
          <h2>בואו להכיר את הכלב שלכם 🐾</h2>
          <p>מלווים כלב וירטואלית? אתם מוזמנים לבוא לבקר ולטייל איתו בבית המחסה ברמת אפעל — בתיאום מראש.</p>
          <div className="va-visit-actions">
            <a className="btn btn-gold" href={wa(WA_ADOPT, 'היי! אני מלווה כלב וירטואלית ואשמח לתאם ביקור בבית המחסה 🐾')} target="_blank" rel="noopener">💬 קבעו ביקור בוואטסאפ</a>
            <a className="btn btn-outline-green" href={WAZE_SHELTER} target="_blank" rel="noopener">🗺️ ניווט בוויז</a>
          </div>
        </div>
      </section>

      <section className="va-newsletter">
        <div className="va-newsletter-inner reveal">
          <h2>רוצים לקבל עדכונים? 💌</h2>
          <p>הישארו מעודכנים בסיפורי הצלה, אימוצים מרגשים ורגעים קטנים של אושר — היישר לוואטסאפ שלכם.</p>
          <a className="btn btn-gold" href={wa(WA_ADOPT, 'היי! אשמח להצטרף לרשימת העדכונים של העמותה 💌')} target="_blank" rel="noopener">הוסיפו אותי לרשימת העדכונים ←</a>
        </div>
      </section>
    </>
  )
}
