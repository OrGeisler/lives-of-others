import { MAPS_SHELTER, WAZE_SHELTER } from '../../lib/constants'
import { VOLUNTEER_STORIES } from '../../lib/volunteerStories'
import { VOLUNTEER_STORIES_EN } from '../../lib/volunteerStoriesEn'
import { useLang } from '../../lib/lang'
import VolStories from '../VolStories'
// Static home-page sections, converted 1:1 from the static site (index.html on main).
// Texts are kept verbatim; dynamic sections (team, memorials, dogs, birthday, counters, contact) live in their own files.
import { Link } from 'react-router-dom'
import { WA_ADOPT, wa } from '../../lib/links'

export function Story() {
  const { t, to, arrow } = useLang()
  return (
    <>
      <section className="wrap story">
        {/* 24.9: סרטון זמני (Give Together) עד שיגיע הסרטון הערוך של ברי */}
        <div className="story-video reveal">
          <iframe src="https://www.youtube-nocookie.com/embed/jO9JChY_ETM?rel=0" title={t('הם ננטשו. אנחנו לא ננטוש אותם', "They were abandoned. We won't abandon them.")} loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <div className="story-copy reveal">
          <h2>{t('בדרך להתחלה חדשה', 'On the way to a new beginning')}</h2>
          <p className="story-lead">{t('יש רגע אחד שבו הכלב מבין שהוא נשאר לבד. זהו רגע שבו האמון נשבר והלב שלו נסגר.', "There is one moment when a dog understands he has been left alone. It's the moment trust breaks and his heart closes.")}</p>
          {t(<p><strong>בעמותת חיים של אחרים אנחנו נלחמים להצלת כלבים מהשטח</strong>, ופועלים כדי שהרגע הזה לא יהיה סוף הסיפור שלהם — אלא רק שלב בדרך להתחלה חדשה.</p>,
            <p><strong>At Lives of Others we fight to rescue dogs from the field</strong>, so that this moment won't be the end of their story — only a step on the way to a new beginning.</p>)}
          {/* 24.9: כפתור תרומה אחד. הטקסט הסופי ("לתרומה לשיקום של...") ייקבע כשיגיע הסרטון הערוך של ברי */}
          <div className="cta-row">
            <Link to={to('/donate')} className="btn btn-gold">{t('לתרומה לשיקום הכלבים', "Donate to the dogs' rehabilitation")} {arrow}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function About() {
  const { t } = useLang()
  return (
    <>
      <section id="about" className="about-band">
        <div className="wrap about">
          <div className="about-copy reveal">
            <h2>{t('על העמותה', 'About us')}</h2>
            {t(<p>עמותת חיים של אחרים נוסדה בשנת 2016 על ידי <strong>טלי עבאדי ודבורה אטיה</strong>, במטרה להציל כלבים מהרחוב ומההסגרים ברחבי הארץ.</p>,
              <p>Lives of Others was founded in 2016 by <strong>Tali Abadi and Dvora Atia</strong>, to rescue dogs from the streets and pounds across Israel.</p>)}
            <p>{t('חיים של אחרים היא עמותה ללא מטרת רווח (מלכ"ר) הפועלת על טהרת ההתנדבות, ומצילה מאות כלבים בכל שנה מהמתה — במטרה להעניק להם הזדמנות שנייה לחיים.', 'Lives of Others is a registered non-profit run entirely by volunteers, saving hundreds of dogs from euthanasia every year — to give them a second chance at life.')}</p>
            <div className="about-quote">
              <p>{t('העמותה דוגלת בקידוש החיים ולעולם אינה ממיתה כלבים. כל כלב שמגיע אלינו נשאר תחת חסותנו, מטופל ואהוב — עד שיאומץ, או עד שיגיע לשיבה טובה.', 'We believe in the sanctity of life and never put dogs down. Every dog that reaches us stays in our care, treated and loved — until adopted, or until a good old age.')}</p>
            </div>
          </div>
          <div className="about-video reveal">
            <video autoPlay muted loop playsInline preload="metadata" poster="/assets/img/montage-poster.jpg" aria-label={t('רגעים מפעילות העמותה', 'Moments from our work')}>
              <source src="/assets/video/montage-draft.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </>
  )
}

export function Unique() {
  const { t } = useLang()
  return (
    <>
      <section className="unique">
        <h2 className="reveal">{t('מה מייחד את עמותת חיים של אחרים', 'What makes Lives of Others different')}</h2>
        {t(<p className="reveal"><strong>במקום כלובים — בתים.</strong> בפרויקט הדגל הייחודי שלנו אנחנו משכנים את הכלבים <strong>בבתים קסומים</strong>. הבתים הקסומים הם פרויקט הנצחה לזכר יקירים שנפלו ונרצחו במלחמת ה־7 באוקטובר — בבתים אלו מורשתם של סמ״ר עדי צור, רס״ם במילואים יאיר כץ ושני גבאי ממשיכה לחיות דרך הצלת כלבים ונתינה לבעלי חיים.</p>,
          <p className="reveal"><strong>Homes instead of cages.</strong> In our unique flagship project, the dogs live in <strong>Magical Homes</strong>. The Magical Homes are memorial projects for loved ones who fell and were murdered in the October 7 war — in these homes, the legacy of Staff Sgt. Adi Tzur, Reserve Master Sgt. Yair Katz and Shani Gabay lives on through saving dogs and giving to animals.</p>)}
        {/* 17.10: "סרטון דבורה – במקום כלובים בתים" (26.10: the reel is 16:9; self-hosted so it isn't squeezed and opens full screen on phones). 4 כפתורי הפעולה הוסרו לבקשת העמותה (13.10) */}
        <div className="unique-video reveal">
          <video controls playsInline preload="metadata" poster="/assets/img/dvora-poster.jpg" aria-label={t('דבורה: במקום כלובים — בתים', 'Dvora: homes instead of cages (Hebrew)')}>
            <source src="/assets/video/dvora.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  )
}

export function Press() {
  const { t, arrow } = useLang()
  return (
    <>
      <section className="press">
        <div className="wrap">
          <div className="section-head reveal"><h2>{t('מדברים עלינו 📰', 'In the news 📰')}</h2><p>{t('העמותה והכלבים שלנו בתקשורת', 'Our nonprofit and our dogs in the media')}</p></div>
          <div className="press-grid reveal">
            <a className="press-card" href="https://www.mako.co.il/entertainment-celebs/local-2022/Article-cc51807270aae71026.htm" target="_blank" rel="noopener">
              <span className="press-src">mako · 2022</span>
              <strong>{t('על הסט הכי חלומי: שלומית מלכה מצטלמת', 'On the dreamiest set: Shlomit Malka photoshoot')}</strong>
              <span>{t('הדוגמנית שלומית מלכה הצטלמה עם כלבים שלנו בקמפיין של קסטרו, בפרויקט להעלאת המודעות לאימוץ.', "Model Shlomit Malka posed with our dogs in a Castro campaign, to raise awareness of adoption (Hebrew).")}</span>
              <em>{t('לכתבה', 'Read the article')} {arrow}</em>
            </a>
            {/* 26.10: on phones the TV sits below the hero text, so "/" went nowhere; scroll to the TV itself */}
            <a className="press-card" href="#tv" onClick={e => { e.preventDefault(); document.getElementById('tv')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>
              <span className="press-src">{t('ערוץ 12', 'Channel 12')}</span>
              <strong>{t('הכתבה ששודרה בערוץ 12', "Our story on Israel's Channel 12")}</strong>
              <span>{t('הכתבה על העמותה ששודרה בערוץ 12 — מתנגנת בראש עמוד הבית.', 'The report about us that aired on Channel 12 — playing at the top of the home page (Hebrew).')}</span>
              <em>{t('לצפייה', 'Watch')} {arrow}</em>
            </a>
            <a className="press-card" href="https://youtu.be/jO9JChY_ETM" target="_blank" rel="noopener">
              <span className="press-src">YouTube · Give Together</span>
              <strong>{t('הם ננטשו. אנחנו לא ננטוש אותם 🐾', "They were abandoned. We won't abandon them 🐾")}</strong>
              <span>{t('הסרטון שפורסם בערוץ היוטיוב של Give Together.', "The video published on Give Together's YouTube channel.")}</span>
              <em>{t('לצפייה', 'Watch')} {arrow}</em>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export function Volunteer() {
  const { en, t, to, arrow } = useLang()
  return (
    <>
      <section id="volunteer" className="volunteer-band">
        <div className="wrap volunteer">
          <div className="section-head reveal">
            <h2>{t('אנחנו צריכים אתכם', 'We need you')}</h2>
            <p>{t('רוצים להתנדב אצלנו? הכלבים שלנו מחכים לכם — מחכים שהשער ייפתח, שייצאו לטייל במרחב הפתוח ויזכו בליטוף. עבורם, טיול אתכם הוא השיא של היום. ועבורכם, הזדמנות מושלמת להתנתק מהשגרה, למלא את הלב ולחזור הביתה עם חיוך.', "Want to volunteer with us? Our dogs are waiting for you — waiting for the gate to open, to go out walking in the open fields and get a pat. For them, a walk with you is the highlight of the day. For you, it's the perfect chance to disconnect from routine, fill your heart and go home with a smile.")}</p>
          </div>
          <img className="vol-banner reveal" src="/assets/img/dog-pil-1.jpg" alt={t('פיל מחכה למתנדבים', 'Pil waiting for volunteers')} style={{ objectPosition: "50% 17%" }} />
          <div className="vol-info reveal">
            <div className="vol-info-card"><span className="vol-icon">📍</span><strong>{t('איפה?', 'Where?')}</strong><p>{t('בית המחסה של עמותת חיים של אחרים, רמת אפעל.', 'The Lives of Others shelter, Ramat Efal.')}<br /><span className="vol-map-note">🗺️ <strong>{t('הבית הקסום לזכרו של סמ״ר עדי צור', 'The Magical Home in memory of Staff Sgt. Adi Tzur')}</strong> · {t('ניווט:', 'Navigate:')} <a href={WAZE_SHELTER} target="_blank" rel="noopener">Waze</a> · <a href={MAPS_SHELTER} target="_blank" rel="noopener">Google Maps</a></span></p></div>
            <div className="vol-info-card"><span className="vol-icon">🗓️</span><strong>{t('מתי?', 'When?')}</strong><p>{t('בכל ימות השבוע, בתיאום מראש.', 'Every day of the week, by arrangement.')}</p></div>
            <div className="vol-info-card"><span className="vol-icon">👥</span><strong>{t('למי זה מתאים?', 'Who is it for?')}</strong><p>{t('מתנדבים מגיל 16 ומעלה. בימי שבת יוצאים טיולים משפחתיים המשלבים הורים וילדים.', 'Volunteers aged 16 and up. On Saturdays there are family walks for parents and children.')}</p></div>
          </div>
          <div className="vol-notes reveal">
            <strong>{t('כמה נקודות שהכלבים שלנו ביקשו שנציין 🐾', 'A few things our dogs asked us to mention 🐾')}</strong>
            <ul>
              <li>{t('קחו בחשבון שאנחנו קצת שובבים ושוקלים מעל 25 ק"ג.', "Keep in mind that we're a bit naughty and weigh over 25 kg.")}</li>
              <li>{t('אל תשכחו להביא: נעליים סגורות המתאימות להליכה בשדה, בגדים נוחים שיכולים להתלכלך ובקבוק מים.', "Don't forget to bring: closed shoes for walking in the field, comfortable clothes that can get dirty, and a water bottle.")}</li>
              <li>{t('ניתן ואפילו מומלץ להביא חטיפי כלבים ולפנק אותנו במהלך הטיול.', "You're welcome — even encouraged — to bring dog treats and spoil us during the walk.")}</li>
            </ul>
          </div>
          <VolStories stories={en ? VOLUNTEER_STORIES_EN : VOLUNTEER_STORIES} lang={en ? 'en' : 'he'} />
          <div className="vol-cta reveal">
            <a className="btn btn-green" href={wa(WA_ADOPT, t('היי! אני רוצה להתנדב בעמותת חיים של אחרים 🐾', "Hi! I'd like to volunteer with Lives of Others 🐾"))} target="_blank" rel="noopener">{t('אני רוצה להתנדב', 'I want to volunteer')}</a>
          </div>
          <div className="vol-more reveal">
            {t(<p>רוצים לעזור בתחומים נוספים — שיווק, גיוס תרומות, או שיפוץ ותחזוקה של הבתים שלנו? <strong>העזרה שלכם יכולה לשנות לכלבים את החיים</strong></p>,
              <p>Want to help in other ways — marketing, fundraising, or renovating and maintaining our homes? <strong>Your help can change the dogs' lives</strong></p>)}
            <Link to={to('/contact')} className="btn btn-gold">{t('ספרו לנו איך תרצו לעזור', "Tell us how you'd like to help")} {arrow}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

// 26.10: "עדכונים מהשטח" removed; the social box moved from /donate to the home page, after the gift banner
export function Social() {
  const { t, arrow } = useLang()
  return (
    <section className="wrap social-home">
      <div className="social-box reveal">
        <h3>{t('עקבו אחרינו ברשתות', 'Follow us on social media')}</h3>
        <p>{t('כלבים חדשים, אימוצים מרגשים ורגעים קטנים של אושר — כל יום, בפייסבוק ובאינסטגרם.', 'New dogs, moving adoptions and small moments of happiness — every day, on Facebook and Instagram.')}</p>
        <div className="social-thumbs">
          <img src="/assets/img/dog-trail.jpg" alt="" loading="lazy" />
          <img src="/assets/img/puppy.jpg" alt="" loading="lazy" />
          <img src="/assets/img/dog-tub.jpg" alt="" loading="lazy" />
          <img src="/assets/img/dog-shepherd.jpg" alt="" loading="lazy" />
          <img src="/assets/img/adopt-me-cafe.jpg" alt="" loading="lazy" />
          <img src="/assets/img/hero-two-dogs.jpg" alt="" loading="lazy" />
        </div>
        <a className="fb-link" href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">facebook.com/lifeofothers {arrow}</a>
        <a className="fb-link" href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">@lives.of.others.rescue {arrow}</a>
      </div>
    </section>
  )
}
