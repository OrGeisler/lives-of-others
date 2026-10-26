import { Link } from 'react-router-dom'
import GiftBox from '../GiftBox'
import { useLang } from '../../lib/lang'

// 22.10: the gift banner (moved here from the virtual-adoption page), under "מדברים עלינו",
// in the festive style of the birthday page: gradient band, confetti, the dog popping out of a gift box.
export default function GiftHome() {
  const { t, to, arrow } = useLang()
  return (
    <section className="gift-home">
      <span className="gh-confetti c1" aria-hidden="true" /><span className="gh-confetti c2" aria-hidden="true" />
      <span className="gh-confetti c3" aria-hidden="true" /><span className="gh-confetti c4" aria-hidden="true" />
      <div className="wrap gift-home-inner reveal">
        <GiftBox alt={t('כלב קופץ מתוך קופסת מתנה', 'A dog popping out of a gift box')} />
        <div className="gift-home-body">
          <span className="gift-home-tag">{t('🎁 אימוץ במתנה', '🎁 Adopt as a gift')}</span>
          {t(<h2>רוצה להעניק מתנה מרגשת <span>לאדם אהוב?</span></h2>, <h2>Want to give a moving gift <span>to someone you love?</span></h2>)}
          {/* 26.10: the nonprofit's wording, "ב־180 ₪ בלבד" stands out */}
          {t(<p>העניקו להם מתנה שמרחיבה את הלב. <mark className="gh-price">ב־180 ₪ בלבד</mark>, אתם מאמצים וירטואלית כלב מקסים עבור מי שאתם אוהבים.</p>,
            <p>Give them a gift that warms the heart. <mark className="gh-price">For just ₪180</mark>, you virtually adopt a lovely dog for someone you love.</p>)}
          <p>{t('הם יקבלו סרטון תודה מהכלב שבחרתם עבורם, תעודת אימוץ מיוחדת ועדכונים חודשיים מהשטח, והכלב יזכה בזכותכם לכל האוכל, הטיפול והאהבה שהוא כל כך צריך.', "They'll get a thank-you video from the dog you chose, a special adoption certificate and monthly updates from the field — and thanks to you, the dog gets all the food, care and love they need so much.")}</p>
          <Link to={to('/gift-adoption')} className="btn gift-home-btn">{t('לאימוץ במתנה', 'Adopt as a gift')} {arrow}</Link>
        </div>
      </div>
    </section>
  )
}
