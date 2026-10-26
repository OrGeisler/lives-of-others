import { MAPS_SHELTER, WAZE_SHELTER } from '../../lib/constants'
import { VOLUNTEER_STORIES } from '../../lib/volunteerStories'
import VolStories from '../VolStories'
// Static home-page sections, converted 1:1 from the static site (index.html on main).
// Texts are kept verbatim; dynamic sections (team, memorials, dogs, birthday, counters, contact) live in their own files.
import { Link } from 'react-router-dom'
import { DONATE_URL, WA_ADOPT, wa } from '../../lib/links'

export function Story() {
  return (
    <>
      <section className="wrap story">
        {/* 24.9: סרטון זמני (Give Together) עד שיגיע הסרטון הערוך של ברי */}
        <div className="story-video reveal">
          <iframe src="https://www.youtube-nocookie.com/embed/jO9JChY_ETM?rel=0" title="הם ננטשו. אנחנו לא ננטוש אותם" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <div className="story-copy reveal">
          <h2>בדרך להתחלה חדשה</h2>
          <p className="story-lead">יש רגע אחד שבו הכלב מבין שהוא נשאר לבד. זהו רגע שבו האמון נשבר והלב שלו נסגר.</p>
          <p><strong>בעמותת חיים של אחרים אנחנו נלחמים להצלת כלבים מהשטח</strong>, ופועלים כדי שהרגע הזה לא יהיה סוף הסיפור שלהם — אלא רק שלב בדרך להתחלה חדשה.</p>
          {/* 24.9: כפתור תרומה אחד. הטקסט הסופי ("לתרומה לשיקום של...") ייקבע כשיגיע הסרטון הערוך של ברי */}
          <div className="cta-row">
            <Link to="/donate" className="btn btn-gold">לתרומה לשיקום הכלבים ←</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function About() {
  return (
    <>
      <section id="about" className="about-band">
        <div className="wrap about">
          <div className="about-copy reveal">
            <h2>על העמותה</h2>
            <p>עמותת חיים של אחרים נוסדה בשנת 2016 על ידי <strong>טלי עבאדי ודבורה אטיה</strong>, במטרה להציל כלבים מהרחוב ומההסגרים ברחבי הארץ.</p>
            <p>חיים של אחרים היא עמותה ללא מטרת רווח (מלכ"ר) הפועלת על טהרת ההתנדבות, ומצילה מאות כלבים בכל שנה מהמתה — במטרה להעניק להם הזדמנות שנייה לחיים.</p>
            <div className="about-quote">
              <p>העמותה דוגלת בקידוש החיים ולעולם אינה ממיתה כלבים. כל כלב שמגיע אלינו נשאר תחת חסותנו, מטופל ואהוב — עד שיאומץ, או עד שיגיע לשיבה טובה.</p>
            </div>
          </div>
          <div className="about-video reveal">
            <video autoPlay muted loop playsInline preload="metadata" poster="/assets/img/montage-poster.jpg" aria-label="רגעים מפעילות העמותה">
              <source src="/assets/video/montage-draft.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </>
  )
}

export function Unique() {
  return (
    <>
      <section className="unique">
        <h2 className="reveal">מה מייחד את עמותת חיים של אחרים</h2>
        <p className="reveal"><strong>במקום כלובים — בתים.</strong> בפרויקט הדגל הייחודי שלנו אנחנו משכנים את הכלבים <strong>בבתים קסומים</strong>. הבתים הקסומים הם פרויקט הנצחה לזכר יקירים שנפלו ונרצחו במלחמת ה־7 באוקטובר — בבתים אלו מורשתם של סמ״ר עדי צור, רס״ם במילואים יאיר כץ ושני גבאי ממשיכה לחיות דרך הצלת כלבים ונתינה לבעלי חיים.</p>
        {/* 17.10: "סרטון דבורה – במקום כלובים בתים" (26.10: the reel is 16:9; self-hosted so it isn't squeezed and opens full screen on phones). 4 כפתורי הפעולה הוסרו לבקשת העמותה (13.10) */}
        <div className="unique-video reveal">
          <video controls playsInline preload="metadata" poster="/assets/img/dvora-poster.jpg" aria-label="דבורה: במקום כלובים — בתים">
            <source src="/assets/video/dvora.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  )
}

export function Press() {
  return (
    <>
      <section className="press">
        <div className="wrap">
          <div className="section-head reveal"><h2>מדברים עלינו 📰</h2><p>העמותה והכלבים שלנו בתקשורת</p></div>
          <div className="press-grid reveal">
            <a className="press-card" href="https://www.mako.co.il/entertainment-celebs/local-2022/Article-cc51807270aae71026.htm" target="_blank" rel="noopener">
              <span className="press-src">mako · 2022</span>
              <strong>על הסט הכי חלומי: שלומית מלכה מצטלמת</strong>
              <span>הדוגמנית שלומית מלכה הצטלמה עם כלבים שלנו בקמפיין של קסטרו, בפרויקט להעלאת המודעות לאימוץ.</span>
              <em>לכתבה ←</em>
            </a>
            {/* 26.10: on phones the TV sits below the hero text, so "/" went nowhere; scroll to the TV itself */}
            <a className="press-card" href="#tv" onClick={e => { e.preventDefault(); document.getElementById('tv')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>
              <span className="press-src">ערוץ 12</span>
              <strong>הכתבה ששודרה בערוץ 12</strong>
              <span>הכתבה על העמותה ששודרה בערוץ 12 — מתנגנת בראש עמוד הבית.</span>
              <em>לצפייה ←</em>
            </a>
            <a className="press-card" href="https://youtu.be/jO9JChY_ETM" target="_blank" rel="noopener">
              <span className="press-src">YouTube · Give Together</span>
              <strong>הם ננטשו. אנחנו לא ננטוש אותם 🐾</strong>
              <span>הסרטון שפורסם בערוץ היוטיוב של Give Together.</span>
              <em>לצפייה ←</em>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export function Volunteer() {
  return (
    <>
      <section id="volunteer" className="volunteer-band">
        <div className="wrap volunteer">
          <div className="section-head reveal">
            <h2>אנחנו צריכים אתכם</h2>
            <p>רוצים להתנדב אצלנו? הכלבים שלנו מחכים לכם — מחכים שהשער ייפתח, שייצאו לטייל במרחב הפתוח ויזכו בליטוף. עבורם, טיול אתכם הוא השיא של היום. ועבורכם, הזדמנות מושלמת להתנתק מהשגרה, למלא את הלב ולחזור הביתה עם חיוך.</p>
          </div>
          <img className="vol-banner reveal" src="/assets/img/dog-pil-1.jpg" alt="פיל מחכה למתנדבים" style={{ objectPosition: "50% 17%" }} />
          <div className="vol-info reveal">
            <div className="vol-info-card"><span className="vol-icon">📍</span><strong>איפה?</strong><p>בית המחסה של עמותת חיים של אחרים, רמת אפעל.<br /><span className="vol-map-note">🗺️ <strong>הבית הקסום לזכרו של סמ״ר עדי צור</strong> · ניווט: <a href={WAZE_SHELTER} target="_blank" rel="noopener">Waze</a> · <a href={MAPS_SHELTER} target="_blank" rel="noopener">Google Maps</a></span></p></div>
            <div className="vol-info-card"><span className="vol-icon">🗓️</span><strong>מתי?</strong><p>בכל ימות השבוע, בתיאום מראש.</p></div>
            <div className="vol-info-card"><span className="vol-icon">👥</span><strong>למי זה מתאים?</strong><p>מתנדבים מגיל 16 ומעלה. בימי שבת יוצאים טיולים משפחתיים המשלבים הורים וילדים.</p></div>
          </div>
          <div className="vol-notes reveal">
            <strong>כמה נקודות שהכלבים שלנו ביקשו שנציין 🐾</strong>
            <ul>
              <li>קחו בחשבון שאנחנו קצת שובבים ושוקלים מעל 25 ק"ג.</li>
              <li>אל תשכחו להביא: נעליים סגורות המתאימות להליכה בשדה, בגדים נוחים שיכולים להתלכלך ובקבוק מים.</li>
              <li>ניתן ואפילו מומלץ להביא חטיפי כלבים ולפנק אותנו במהלך הטיול.</li>
            </ul>
          </div>
          <VolStories stories={VOLUNTEER_STORIES} />
          <div className="vol-cta reveal">
            <a className="btn btn-green" href={wa(WA_ADOPT, 'היי! אני רוצה להתנדב בעמותת חיים של אחרים 🐾')} target="_blank" rel="noopener">אני רוצה להתנדב</a>
          </div>
          <div className="vol-more reveal">
            <p>רוצים לעזור בתחומים נוספים — שיווק, גיוס תרומות, או שיפוץ ותחזוקה של הבתים שלנו? <strong>העזרה שלכם יכולה לשנות לכלבים את החיים</strong></p>
            <Link to="/contact" className="btn btn-gold">ספרו לנו איך תרצו לעזור ←</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function Donate() {
  return (
    <>
      <section id="donate" className="wrap donate">
        <div className="section-head reveal">
          <h2>קיומנו תלוי אך ורק בתרומות ובמתנדבים</h2>
          <p>אנו זקוקים לעזרתכם כדי להמשיך לממן מזון, טיפול רפואי ואת אחזקת הבתים הקסומים. ללא תמיכתכם, לא נוכל להמשיך להילחם על חייהם של הכלבים הנטושים.</p>
        </div>
        <div className="donate-grid">
          <div className="donate-card reveal">
            <span className="d-icon">💳</span>
            <strong>כרטיס אשראי / הוראת קבע</strong>
            <p>תרומה מאובטחת (סליקת Grow/משולם), חד־פעמית או חודשית.</p>
            <a className="d-link" href={DONATE_URL} target="_blank" rel="noopener">לתרומה מאובטחת ←</a>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">📱</span>
            <strong>ביט / פייבוקס</strong>
            <p>ביט: <b>052-8296622</b><br />פייבוקס: <b>054-6881116</b></p>
            <a className="d-link" href="https://links.payboxapp.com/mr8NxOzWKUb" target="_blank" rel="noopener">לתשלום בפייבוקס ←</a>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">🏦</span>
            <strong>העברה בנקאית</strong>
            <p className="bank-details">למוטב: <b>חיים של אחרים</b><br />בנק מזרחי טפחות (20)<br />סניף כנפי נשרים (539)<br />חשבון: <b>497218</b></p>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">🌍</span>
            <strong>תרומה מחו"ל / PayPal</strong>
            <p>לתורמים מחוץ לישראל — תרומה מהירה ומאובטחת בפייפאל.</p>
            <a className="d-link" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">paypal.me/savingthedogs ←</a>
          </div>
        </div>
      </section>
    </>
  )
}

// 26.10: "עדכונים מהשטח" removed; the social box moved from /donate to the home page, after the gift banner
export function Social() {
  return (
    <section className="wrap social-home">
      <div className="social-box reveal">
        <h3>עקבו אחרינו ברשתות</h3>
        <p>כלבים חדשים, אימוצים מרגשים ורגעים קטנים של אושר — כל יום, בפייסבוק ובאינסטגרם.</p>
        <div className="social-thumbs">
          <img src="/assets/img/dog-trail.jpg" alt="" loading="lazy" />
          <img src="/assets/img/puppy.jpg" alt="" loading="lazy" />
          <img src="/assets/img/dog-tub.jpg" alt="" loading="lazy" />
          <img src="/assets/img/dog-shepherd.jpg" alt="" loading="lazy" />
          <img src="/assets/img/adopt-me-cafe.jpg" alt="" loading="lazy" />
          <img src="/assets/img/hero-two-dogs.jpg" alt="" loading="lazy" />
        </div>
        <a className="fb-link" href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">facebook.com/lifeofothers ←</a>
        <a className="fb-link" href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">@lives.of.others.rescue ←</a>
      </div>
    </section>
  )
}
