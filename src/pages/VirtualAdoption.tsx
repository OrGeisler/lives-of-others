import { focusStyle } from '../lib/focus'
import { Link } from 'react-router-dom'
import { VaAccordions, VaTiers } from '../components/VirtualAdoptionDetails'
import { WA_ADOPT, wa } from '../lib/links'
import { useVirtualDogs } from '../lib/checkout'
import { rememberGallery, useRestoreGallery } from '../lib/galleryScroll'
import { MAPS_SHELTER, WAZE_SHELTER } from '../lib/constants'
import '../styles/checkout.css'
import { useTitle } from '../lib/pagesData'
import '../styles/pages.css'
import { useLang } from '../lib/lang'


export default function VirtualAdoption() {
  const vdogs = useVirtualDogs()
  useRestoreGallery(!!vdogs?.length, 'choose')
  useTitle('אימוץ וירטואלי — חיים של אחרים', 'Virtual adoption — Lives of Others')
  const { t, to, db, arrow } = useLang()
  return (
    <>
      <section className="va-hero">
        <div className="wrap">
          <Link className="va-back" to={to('/dogs')}>{t('→ חזרה לכלבים', '← Back to the dogs')}</Link>
          <h1 className="va-h1">
            {t('בוא להיות המלאך השומר שלי', 'Come be my guardian angel')}{' '}
            <svg className="va-heart" viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M12 21s-7.5-4.9-10-9.3C.3 8.4 1.7 5 5 5c2 0 3.2 1.1 4 2.3C9.8 6.1 11 5 13 5c3.3 0 4.7 3.4 3 6.7C19.5 16.1 12 21 12 21z" /></svg>
            <span className="va-h1-sub">{t('אימוץ וירטואלי', 'Virtual adoption')}</span>
          </h1>
          {/* 13.10 + 17.10: תמונת החיבוק ("אימוץ וירטואלי 6") לצד הטקסט */}
          <div className="va-hero-body">
            <img className="va-hug" src="/assets/img/va-hug.jpg" alt={t('חיבוק עם כלבים בבית המחסה', 'A hug with dogs at the shelter')} />
            <div className="va-hero-text">
              <p className="va-lead">{t('לא כל אחד יכול לפתוח את הבית – אבל כל אחד יכול לפתוח את הלב.', 'Not everyone can open their home — but everyone can open their heart.')}</p>
              <p>{t('ישנם כלבים שהדרך שלהם לבית קבוע ארוכה יותר. חלקם נמצאים איתנו חודשים וחלקם אף שנים ארוכות. עבורם הקמנו את תוכנית "המלאך השומר שלי".', 'Some dogs have a longer road to a permanent home. Some stay with us for months, some for years. For them we created the "My Guardian Angel" program.')}</p>
              <p>{t('זו הדרך שלכם להפוך למלאכים השומרים של כלב שזקוק לכם — לדעת שיש לכם חבר על ארבע שמחכה לכם וזוכה לחיים טובים בזכותכם.', "It's your way to become the guardian angel of a dog who needs you — knowing there's a four-legged friend waiting for you, living a good life thanks to you.")}</p>
              <p>{t('באימוץ וירטואלי אתם בוחרים כלב מסוים ומלווים אותו מקרוב בחסות חודשית קבועה, עד שימצא בית של ממש.', 'In a virtual adoption you choose a specific dog and accompany them closely with a fixed monthly sponsorship, until they find a real home.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="va-section">
        <VaAccordions />

        <div className="section-head reveal" style={{ margin: '48px 0 26px' }}>
          <h2>{t('מסלולי החסות החודשית', 'Monthly sponsorship options')}</h2>
          <p>{t('חסות חודשית קבועה (הוראת קבע). אתם בוחרים כלב — ומלווים אותו מדי חודש, עד שימצא בית.', 'A fixed monthly sponsorship (standing order). You choose a dog — and accompany them every month, until they find a home.')}</p>
        </div>
        <VaTiers />

        <div className="va-note reveal">
          <span className="va-note-ic">🤝</span>
          {t(<p><strong>שקיפות מלאה:</strong> הכלב שאתם מלווים נשאר אצלנו בבית המחסה ומקבל אוכל, חיסונים וטיפול. לפעמים כמה אנשים מלווים יחד את אותו כלב — וזה בדיוק הכוח של הקהילה. כל שקל הולך ישירות לטיפול בכלבים שלנו.</p>,
            <p><strong>Full transparency:</strong> the dog you accompany stays with us at the shelter and gets food, vaccines and care. Sometimes several people accompany the same dog together — and that's exactly the power of community. Every shekel goes directly to caring for our dogs.</p>)}
        </div>

        {/* 24.9 (לדיון): בעתיד — גלריית כלבים שמובילה לעמוד אימוץ וירטואלי אישי לכל כלב, במקום הכפתור */}
        {/* 24.9 item 8: a gallery of the dogs — each opens its own virtual-adoption page */}
        <div id="choose" className="section-head reveal" style={{ margin: '44px 0 18px' }}>
          <h2>{t('בחרו את הכלב שתרצו ללוות 🐾', "Choose the dog you'd like to accompany 🐾")}</h2>
          <p>{t('לחצו על כלב כדי להכיר אותו ולבחור מסלול', 'Click a dog to get to know them and choose a plan')}</p>
        </div>
        <div className="va-gallery">
          {vdogs?.map(d => (
            <Link key={d.id} to={to(`/virtual-adoption/${d.slug}`)} className="va-gdog reveal" onClick={rememberGallery}>
              {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={db(d.name, d.name_en)} loading="lazy" />}
              <span className="va-gdog-body"><b>{db(d.name, d.name_en)}</b><span>{db(d.tagline, d.tagline_en)}</span><em>{t('לאמץ וירטואלית', 'Adopt virtually')} {arrow}</em></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="va-visit">
        <div className="va-visit-inner">
          <h2>{t('בואו להכיר את הכלב שלכם 🐾', 'Come meet your dog 🐾')}</h2>
          <p>{t('מלווים כלב וירטואלית? אתם מוזמנים לבוא לבקר ולטייל איתו בבית המחסה — בתיאום מראש.', "Accompanying a dog virtually? You're welcome to visit and walk with them at the shelter — by arrangement.")}</p>
          <div className="va-visit-actions">
            <a className="btn btn-gold" href={wa(WA_ADOPT, t('היי! אני מלווה כלב וירטואלית ואשמח לתאם ביקור בבית המחסה 🐾', "Hi! I'm a virtual adopter and would love to arrange a visit to the shelter 🐾"))} target="_blank" rel="noopener">{t('💬 קבעו ביקור בוואטסאפ', '💬 Arrange a visit on WhatsApp')}</a>
            <a className="btn btn-outline-green" href={WAZE_SHELTER} target="_blank" rel="noopener">{t('🗺️ ניווט בוויז', '🗺️ Navigate with Waze')}</a>
            <a className="btn btn-outline-green" href={MAPS_SHELTER} target="_blank" rel="noopener">📍 Google Maps</a>
          </div>
        </div>
      </section>

      {/* 13.10: "רוצים לקבל עדכונים?" removed: nobody to manage the list for now */}
      {/* 22.10: the gift banner moved to the home page, under "מדברים עלינו" (GiftHome) */}
    </>
  )
}
