import { WAZE_SHELTER } from '../../lib/constants'
// Static home-page sections, converted 1:1 from the static site (index.html on main).
// Texts are kept verbatim; dynamic sections (team, memorials, dogs, birthday, counters, contact) live in their own files.
import { Link } from 'react-router-dom'
import { DONATE_URL, GROW_ITEMS, WA_ADOPT, wa } from '../../lib/links'
import AngelButton from './AngelButton'

export function Story() {
  return (
    <>
      <section className="wrap story">
        {/* 24.9: סרטון זמני (Give Together) עד שיגיע הסרטון הערוך של ברי */}
        <div className="story-video reveal">
          <iframe src="https://www.youtube-nocookie.com/embed/jO9JChY_ETM?rel=0" title="הם ננטשו. אנחנו לא ננטוש אותם" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <div className="story-copy reveal">
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
            <video autoPlay muted loop playsInline preload="metadata" poster="/assets/img/hero-two-dogs.jpg" aria-label="רגעים מפעילות העמותה">
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
        {/* 24.9 עמ' 5: כאן ייכנס "סרטון דבורה – במקום כלובים בתים" (ממתינים לקובץ). ערוץ 12 עבר לעמוד הראשי */}
        <div className="cta-row reveal" style={{ justifyContent: 'center' }}>
          <Link to="/dogs" className="btn btn-orange">אני רוצה לאמץ כלב</Link>
          <Link to="/donate" className="btn btn-gold">אני רוצה לתרום</Link>
          <Link to="/volunteer" className="btn btn-green">אני רוצה להתנדב</Link>
        </div>
        <AngelButton className="reveal" />
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
            <Link className="press-card" to="/">
              <span className="press-src">ערוץ 12</span>
              <strong>הכתבה ששודרה בערוץ 12</strong>
              <span>הכתבה על העמותה ששודרה בערוץ 12 — מתנגנת בראש עמוד הבית.</span>
              <em>לצפייה ←</em>
            </Link>
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

export function Rescues() {
  return (
    <>
      <section id="stories" className="wrap rescues">
        <div className="section-head reveal">
          <h2>סיפורים מהלב</h2>
          <p>סיפורים אמיתיים מתוך העמוד שלנו. אותו כלב, חיים אחרים.</p>
        </div>
        <div className="rescue-grid">
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-placeholder.svg" alt="רוני ולונה — מחכה לתמונה" />
            <strong>רוני ולונה — המלך והמלכה של הבית הקסום</strong>
            <p>רוני ולונה גדלו יחד אצל אדם ערירי, ואחרי פטירתו נזרקו להסגר בגיל 11. ידענו שהסיכויים שלהם למצוא בית קלושים — אבל לא יכולנו לתת להם למות בלי יד מלטפת. הם היו הדיירים הראשונים בבית הקסום ע"ש עדי צור, טופלו שם במסירות אין־קץ, וחיו הרבה מעבר לציפיות — כמעט עד גיל 14. כשהגיע יומו של רוני, הווטרינרית הגיעה אליו הביתה, וכולנו חיבקנו אותו בדרכו האחרונה. זו ההבטחה שלנו לכל כלב: שיבה טובה, בבית, באהבה.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/memorial-yair-bruce.jpg" alt="יאיר וברוס" />
            <strong>ברוס — האהבה שעוברת הלאה</strong>
            <p>כלב פיטבול עם לב זהב, שחיכה שנים בבית המחסה שמישהו יראה אותו מעבר לסטיגמות. יאיר כץ ז"ל היה זה שפתח לו את הלב והפך לחברו הטוב ביותר. אחרי נפילתו של יאיר בעזה, אחיו אימץ את ברוס אליו — ואהבה אמיתית, מסתבר, פשוט עוברת הלאה.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/memorial-adi-leni.jpg" alt="עדי צור עם לני" style={{ objectPosition: 'center 15%' }} />
            <strong>לני — הכלבה שעדי בחר</strong>
            <p>לני עברה התעללות קשה וחיכתה שנים בבית המחסה, מפוחדת כל כך שאיש לא העז להתקרב אליה. עדי צור בחר בה דווקא בגלל הקושי שלה, ובסבלנות של מלאך החזיר לה את האמון בבני אדם. אחרי שעדי נפל בהגנה על קיבוץ כיסופים, הוריו אימצו את לני אליהם — היום היא הנחמה שלהם, והם הביטחון שלה.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-placeholder.svg" alt="רני — מחכה לתמונה" />
            <strong>רני — הפעם זה לתמיד</strong>
            <p>לפני כמעט שלוש שנים הוצאנו את רני מההסגר — אחד הכלבים המתוקים והטובים שפגשנו. הוא אומץ, ושמחנו כל כך בשבילו. ואז קיבלנו את הטלפון שאף עמותה לא רוצה לקבל: רני חוזר. לא בגללו — הוא לא אשם. רני בן 4, טוב ומלא אהבה, מסתדר עם כולם. עכשיו הוא מחפש אדם אחד שיבטיח לו באמת: הפעם זה לתמיד.</p>
            <a className="btn btn-sm btn-orange" href={wa(WA_ADOPT, 'היי! אני רוצה לאמץ את רני 🐾')} target="_blank" rel="noopener">אני רוצה להיות הבית של רני</a>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-placeholder.svg" alt="בל — מחכה לתמונה" />
            <strong>בל — הכלבה המלאכית</strong>
            <p>מדהימה עם אנשים, ילדים, תינוקות וכל הכלבים. אדישה לחתולים, מחונכת מאה אחוז, יודעת להישאר לבד בבית בנחת, אוהבת להתכרבל וגם לשחק. בת שנתיים, בריאה ומטופלת. בל מבינה סיטואציות וניגשת לכל מצב באהבה — היא תהיה בת משפחה מדהימה לכל בית.</p>
            <a className="btn btn-sm btn-orange" href={wa(WA_ADOPT, 'היי! אני רוצה לאמץ את בל 🐾')} target="_blank" rel="noopener">אני רוצה לאמץ את בל</a>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-placeholder.svg" alt="אקי — מחכה לתמונה" />
            <strong>אקי — הסוף הטוב עוד לפניה</strong>
            <p>חולצה ממגרש גרוטאות כשהייתה גורה. היום היא כלבה צעירה, בריאה ומדהימה עם אנשים וילדים — והפרק הבא בסיפור שלה, הבית הקבוע, עדיין מחכה להיכתב. אולי אצלכם?</p>
          </article>
        </div>
        <p className="dogs-note">הסיפורים מתוך <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">עמוד הפייסבוק שלנו</a> — שם תמצאו עדכון חדש כמעט כל יום 🐾</p>
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
            <p>רוצים להתנדב אצלנו? הכלבים שלנו מחכים לכם — מחכים שהשער ייפתח, שייצאו לטייל במרחב הפתוח ויזכו בליטוף. עבורם, טיול אתכם הוא השיא של היום; ועבורכם, הזדמנות מושלמת להתנתק מהשגרה, למלא את הלב ולחזור הביתה עם חיוך.</p>
          </div>
          <img className="vol-banner reveal" src="/assets/img/dog-gili-1.jpg" alt="מבט של כלב מחכה למתנדב" />
          <div className="vol-info reveal">
            <div className="vol-info-card"><span className="vol-icon">📍</span><strong>איפה?</strong><p>בית המחסה של עמותת חיים של אחרים, רמת אפעל.<br /><span className="vol-map-note">🗺️ בוויז חפשו: <a href={WAZE_SHELTER} target="_blank" rel="noopener"><strong>״הבית הקסום ע״ש עדי צור״</strong></a></span></p></div>
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
          <div className="vol-cta reveal">
            <a className="btn btn-green" href={wa(WA_ADOPT, 'היי! אני רוצה להתנדב בעמותת חיים של אחרים 🐾')} target="_blank" rel="noopener">אני רוצה להתנדב</a>
          </div>
          <p className="vol-more reveal">רוצים לעזור בתחומים נוספים — שיווק, גיוס תרומות, או שיפוץ ותחזוקה של הבתים שלנו? <Link to="/contact">מלאו את הפרטים וציינו כיצד תרצו לעזור ←</Link></p>
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

export function Updates() {
  return (
    <>
      <section className="wrap updates">
        <div className="updates-grid">
          <div className="updates-list reveal">
            <h2>עדכונים מהשטח</h2>
            <div className="update-card">
              <img src="/assets/img/sleeping-bandana.jpg" alt="כלבה ישנה בבית אומנה" />
              <div className="update-body">
                <span className="update-date">עכשיו בעמוד הפייסבוק</span>
                <strong>הכלבים שלנו רוצים לאכול 🙏</strong>
                <p>קערה אחרי קערה, שק אחרי שק. עשרות כלבים תלויים בנו בכל יום — ואנחנו תלויים בכם. גם תרומה קטנה ממלאה עוד קערה.</p>
              </div>
            </div>
            <div className="update-card">
              <img src="/assets/img/dog-car-kid.jpg" alt="זום בדרך לאומנה" />
              <div className="update-body">
                <span className="update-date">דרוש דחוף</span>
                <strong>מחפשים אומנה לזום — העמותה משלמת 1,200 ₪ בחודש</strong>
                <p>זום צריך רק בית זמני ולב פתוח. את כל השאר — אוכל, וטרינר וליווי — אנחנו מממנים.</p>
              </div>
            </div>
            <div className="update-card">
              <img src="/assets/img/volunteers.jpg" alt="מתנדבים עם כלב" />
              <div className="update-body">
                <span className="update-date">אפשר לעזור גם בציוד</span>
                <strong>דרושים: רתמות, רצועות ושקי אוכל</strong>
                <p>נמצאים ברמת אפעל. מוזמנים לתאם הגעה: 054-6881116 — כל תרומת ציוד מתקבלת בזנבות מכשכשים.</p>
                <a className="update-cta" href={GROW_ITEMS} target="_blank" rel="noopener">🦴 לתרומת ציוד ←</a>
              </div>
            </div>
          </div>
          <div className="social-box reveal">
            <h3>עקבו אחרינו ברשתות</h3>
            <p>כלבים חדשים, אימוצים מרגשים ורגעים קטנים של אושר — כל יום, בפייסבוק ובאינסטגרם.</p>
            <div className="social-thumbs">
              <img src="/assets/img/dog-trail.jpg" alt="" />
              <img src="/assets/img/puppy.jpg" alt="" />
              <img src="/assets/img/dog-tub.jpg" alt="" />
              <img src="/assets/img/dog-shepherd.jpg" alt="" />
              <img src="/assets/img/adopt-me-cafe.jpg" alt="" />
              <img src="/assets/img/hero-two-dogs.jpg" alt="" />
            </div>
            <a className="fb-link" href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">facebook.com/lifeofothers ←</a>
            <a className="fb-link" href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">@lives.of.others.rescue ←</a>
          </div>
        </div>
      </section>
    </>
  )
}
