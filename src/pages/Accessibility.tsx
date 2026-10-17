import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTitle } from '../lib/pagesData'
import '../styles/pages.css'

// Accessibility statement (Hebrew at /accessibility, English at /en/accessibility).
// Update the date and the limitations list when the site changes.
export default function Accessibility() {
  const en = useLocation().pathname.startsWith('/en')
  useTitle(en ? 'Accessibility statement — Lives of Others' : 'הצהרת נגישות — חיים של אחרים')
  useEffect(() => {
    if (!en) return
    const html = document.documentElement
    html.lang = 'en'; html.dir = 'ltr'
    return () => { html.lang = 'he'; html.dir = 'rtl' }
  }, [en])
  if (en) return (
    <div className="legal" dir="ltr" lang="en">
      <h1>Accessibility statement</h1>
      <p className="updated">Lives of Others (registered non-profit 580754083) · Last updated: October 2026</p>
      <p>We want everyone, including people with disabilities, to be able to use this website: read about the dogs, donate, adopt virtually and contact us.</p>
      <h2>Accessibility level</h2>
      <p>The site was built to meet Israeli Standard 5568, based on WCAG 2.0 at level AA, and was checked with automated testing (axe) and by hand on desktop and phone browsers.</p>
      <h2>What we did</h2>
      <ul>
        <li>An accessibility menu (the round button at the bottom of the screen): text size, high contrast, highlighted links, a readable font and stopping animations and videos.</li>
        <li>Keyboard navigation, visible focus and logical page structure (headings, landmarks, labelled form fields).</li>
        <li>Text alternatives for meaningful images, and a layout that adapts to phones and to text enlargement.</li>
        <li>The site respects the system setting to reduce motion.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>Embedded videos from Facebook and YouTube, and maps from Waze and Google, are third-party services that we don't control.</li>
        <li>Some coloured buttons have lower contrast than the standard requires; the high-contrast mode in the menu fixes this, and we are working on it.</li>
      </ul>
      <h2>Contact us about accessibility</h2>
      <p>If something on the site isn't accessible to you, please tell us and we'll help and fix it:</p>
      <ul>
        <li>Tali, WhatsApp / phone: <a href="https://wa.me/972546881116" dir="ltr">+972-54-6881116</a></li>
        <li><Link to="/en#contact">The contact form</Link></li>
      </ul>
      <p><Link to="/en">← Back to the site</Link></p>
    </div>
  )
  return (
    <div className="legal">
      <h1>הצהרת נגישות</h1>
      <p className="updated">עמותת "חיים של אחרים" (ע"ר 580754083) · עודכן לאחרונה: אוקטובר 2026</p>
      <p>אנחנו רוצים שכל אחד ואחת, כולל אנשים עם מוגבלות, יוכלו להשתמש באתר: לקרוא על הכלבים, לתרום, לאמץ וירטואלית וליצור איתנו קשר.</p>

      <h2>רמת הנגישות</h2>
      <p>האתר נבנה בהתאם לתקן הישראלי 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013. האתר נבדק בבדיקה אוטומטית (axe) ובבדיקה ידנית בדפדפני מחשב וטלפון.</p>

      <h2>מה עשינו</h2>
      <ul>
        <li>תפריט נגישות (הכפתור העגול בתחתית המסך): הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים, גופן קריא ועצירת אנימציות וסרטונים.</li>
        <li>ניווט במקלדת, סימון ברור של המיקום במסך ומבנה עמוד מסודר (כותרות, אזורים, שדות טופס עם תוויות).</li>
        <li>טקסט חלופי לתמונות בעלות משמעות, ועיצוב שמתאים את עצמו לטלפון ולהגדלת טקסט.</li>
        <li>האתר מכבד את הגדרת המערכת להפחתת תנועה.</li>
      </ul>

      <h2>מגבלות ידועות</h2>
      <ul>
        <li>סרטונים משובצים מפייסבוק ומיוטיוב ומפות של Waze ו-Google הם שירותים של צד שלישי שאינם בשליטתנו.</li>
        <li>בחלק מהכפתורים הצבעוניים הניגודיות נמוכה מהנדרש בתקן. מצב "ניגודיות גבוהה" בתפריט פותר זאת, ואנחנו עובדים על תיקון.</li>
      </ul>

      <h2>פניות בנושא נגישות</h2>
      <p>נתקלתם בבעיה? משהו באתר לא נגיש לכם? ספרו לנו ונשמח לעזור ולתקן:</p>
      <ul>
        <li>טלי · טלפון / וואטסאפ: <a href="https://wa.me/972546881116" dir="ltr">054-6881116</a></li>
        <li>דרך <Link to="/contact">טופס יצירת הקשר באתר</Link></li>
      </ul>
      <p>לפרטים על נגישות ביקור בבית המחסה, פנו אלינו ונתאם מראש.</p>
    </div>
  )
}
