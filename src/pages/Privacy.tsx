import { Link } from 'react-router-dom'
import { useTitle } from '../lib/pagesData'
import { useLang } from '../lib/lang'
import '../styles/pages.css'

// Privacy policy + terms (draft for the nonprofit's lawyer; official e-mail still missing).
export default function Privacy() {
  useTitle('מדיניות פרטיות ותקנון — חיים של אחרים', 'Privacy policy and terms — Lives of Others')
  const { en } = useLang()
  if (en) return <PrivacyEn />
  return (
    <div className="legal">
      <h1>מדיניות פרטיות ותקנון</h1>
      <p className="updated">עמותת "חיים של אחרים" (ע"ר 580754083) · עודכן לאחרונה: אוקטובר 2026</p>

      <div className="toc">
        <strong>תוכן העניינים:</strong><br />
        <a href="#privacy">מדיניות פרטיות</a>
        <a href="#payments">תשלומים ואבטחה</a>
        <a href="#terms">תקנון תרומות ואימוץ וירטואלי</a>
        <a href="#contact">יצירת קשר</a>
        <Link to="/accessibility">הצהרת נגישות</Link>
      </div>

      {/* ===== PRIVACY ===== */}
      <h2 id="privacy">1. מדיניות פרטיות</h2>
      <p>עמותת "חיים של אחרים" (ע"ר 580754083) ("העמותה", "אנחנו") מכבדת את פרטיות המשתמשים באתר זה. מדיניות זו מסבירה איזה מידע נאסף, כיצד נעשה בו שימוש, וכיצד אנו שומרים עליו.</p>

      <h3>1.1 איזה מידע אנו אוספים</h3>
      <ul>
        <li><strong>מידע שאתם מוסרים מרצונכם</strong> — בעת מילוי טופס באתר (יצירת קשר, אימוץ וירטואלי, אימוץ במתנה): שם (לרבות השם לקבלה), טלפון, כתובת דוא"ל, איך הגעתם אלינו, תוכן ההודעה, ובמתנה — גם שם, טלפון ודוא"ל של מקבל/ת המתנה והברכה האישית. מידע זה <strong>נשמר במערכת הניהול של העמותה</strong> ומשמש את צוות העמותה בלבד.</li>
        <li><strong>פרטי מקבל/ת מתנה</strong> — כאשר אתם מוסרים פרטים של אדם אחר (מקבל/ת מתנה), אתם מצהירים כי הוא/היא מסכים/ה לכך שנפנה אליו/ה לצורך מסירת המתנה והעדכונים.</li>
        <li><strong>פרטי תרומה ותשלום</strong> — עסקאות התשלום מתבצעות ומעובדות באמצעות ספק הסליקה החיצוני <strong>Grow (מבית מלם-תשלומים)</strong>. פרטי כרטיס האשראי נמסרים ישירות לספק הסליקה ואינם נשמרים בשרתי העמותה.</li>
        <li><strong>מידע טכני</strong> — שרתי האחסון שומרים יומני גישה טכניים (כגון כתובת IP, סוג דפדפן והעמוד שנפתח) לצורכי אבטחה ותפעול בלבד. האתר אינו מפעיל כלי ניתוח סטטיסטי או פרסום.</li>
      </ul>

      <h3>1.2 השימוש במידע</h3>
      <ul>
        <li>יצירת קשר וטיפול בפניות (אימוץ, התנדבות, תרומה).</li>
        <li>הפקת קבלות ואישורי תרומה, וניהול חסות/אימוץ וירטואלי.</li>
        <li>משלוח תעודת אימוץ, עדכונים חודשיים מהכלב והודעות הקשורות לאימוץ/למתנה — בדוא"ל או בוואטסאפ.</li>
        <li>משלוח עדכונים ותכנים שיווקיים — רק אם סימנתם הסכמה לכך, ועם אפשרות הסרה בכל עת.</li>
        <li>שיפור השירות והתפעול השוטף של העמותה.</li>
      </ul>

      <h3>1.3 מסירת מידע לצד שלישי</h3>
      <p>איננו מוכרים ואיננו מעבירים את המידע שלכם לצדדים שלישיים, למעט: (א) לספקי שירות הפועלים מטעמנו ולצורך מתן השירות בלבד — ספק הסליקה (Grow), שירות אחסון האתר ומסד הנתונים (Vercel, Supabase — שרתים באיחוד האירופי) ושירות משלוח הדוא"ל (Resend); (ב) כאשר הדבר נדרש על פי דין או צו של רשות מוסמכת.</p>

      <h3>1.4 עוגיות (Cookies)</h3>
      <p>האתר עצמו אינו משתמש בעוגיות פרסום, מעקב או מדידה. נשמרות בדפדפן שלכם רק העדפות פשוטות (כמו הגדרות תפריט הנגישות), והן אינן נשלחות אלינו. סרטונים ומפות משובצים מצדדים שלישיים (פייסבוק, יוטיוב, Waze, Google) עשויים לשמור עוגיות משלהם בהתאם למדיניות הפרטיות שלהם. ניתן לחסום או למחוק עוגיות דרך הגדרות הדפדפן.</p>

      <h3>1.5 זכויותיכם</h3>
      <p>בהתאם לחוק הגנת הפרטיות, תשמ"א-1981, אתם זכאים לעיין במידע שנאסף עליכם, לבקש את תיקונו או מחיקתו, ולבטל הסכמה לדיוור. לפניות בנושא — ראו "יצירת קשר" בהמשך.</p>

      <h3>1.6 אבטחת מידע</h3>
      <p>המידע נשמר כל עוד הוא נדרש לניהול התרומה/האימוץ ולעמידה בחובות הדין (כגון שמירת קבלות), ונגיש רק לצוות העמותה המורשה.</p>
      <p>אנו נוקטים באמצעים סבירים לאבטחת המידע. עם זאת, לא ניתן להבטיח הגנה מוחלטת, ואיננו אחראים לנזק שייגרם עקב חדירה בלתי מורשית שאינה בשליטתנו.</p>

      {/* ===== PAYMENTS ===== */}
      <h2 id="payments">2. תשלומים ואבטחה</h2>
      <ul>
        <li>כל התשלומים באתר (תרומות, אימוץ וירטואלי, אימוץ במתנה) מעובדים באמצעות מערכת הסליקה <strong>Grow</strong>, העומדת בתקן אבטחת המידע <strong>PCI-DSS</strong>.</li>
        <li>אמצעי תשלום נתמכים עשויים לכלול כרטיס אשראי, Bit, PayBox ו-Google Pay (בכפוף לזמינות במערכת הסליקה).</li>
        <li>לאחר ביצוע התשלום תישלח קבלה/אישור לכתובת הדוא"ל שמסרתם.</li>
        <li>העמותה אינה שומרת ואינה צופה בפרטי כרטיס האשראי שלכם.</li>
      </ul>

      {/* ===== TERMS ===== */}
      <h2 id="terms">3. תקנון תרומות ואימוץ וירטואלי</h2>
      <h3>3.1 תרומות</h3>
      <p>כל תרומה לעמותה, בין אם כהוראת קבע חודשית ובין אם כתרומה חד-פעמית, מהווה אוויר לנשימה עבור הכלבים ומשמשת באופן ישיר למימון פנסיונים, טיפולים רפואיים מצילי חיים ומזון. לתשומת לב התורמים, העמותה פועלת ללא כוונת רווח, אך תרומות אלו אינן מוכרות לצורכי מס במסגרת סעיף 46 לפקודת מס הכנסה. אנו מודים לכם מעומק הלב על היותכם המלאך השומר של הכלבים – השותפות שלכם היא זו שמאפשרת לנו להמשיך ולהציל חיים.</p>
      <p>ניתן לבטל הוראת קבע בכל עת באמצעות פנייה לעמותה.</p>
      <h3>3.2 אימוץ וירטואלי / "המלאך השומר שלי"</h3>
      <p>אימוץ וירטואלי הוא חסות המסייעת בטיפול בכלב שנבחר. <strong>הכלב נשאר בבית המחסה של העמותה</strong> ואינו עובר לחזקת התורם. ייתכן שמספר תומכים מלווים יחד את אותו כלב. החסות אינה מקנה בעלות או זכויות משפטיות בכלב.</p>
      <h3>3.3 אימוץ במתנה</h3>
      <p>ניתן לרכוש אימוץ וירטואלי כמתנה עבור אדם אחר. מקבל/ת המתנה יקבל/תקבל הודעה ותעודת אימוץ אישית. אין באפשרותנו להתחייב למועד קבלה מדויק במקרים של תקלות טכניות שאינן בשליטתנו.</p>
      <h3>3.4 ביטולים והחזרים</h3>
      <p>ביטול עסקה יתבצע בהתאם להוראות חוק הגנת הצרכן, תשמ"א-1981. לפנייה בעניין ביטול או החזר יש ליצור קשר עם העמותה בפרטים שלהלן.</p>
      <h3>3.5 קניין רוחני</h3>
      <p>כל התכנים באתר (טקסטים, תמונות, סרטונים ולוגו) הם קניינה של העמותה, ואין לעשות בהם שימוש ללא אישור בכתב.</p>

      {/* ===== CONTACT ===== */}
      <h2 id="contact">4. יצירת קשר</h2>
      <p>בכל שאלה בנוגע למדיניות זו, לפרטיות או לתשלומים, ניתן לפנות אלינו:</p>
      <ul>
        <li><strong>עמותת "חיים של אחרים" (ע"ר 580754083)</strong></li>
        <li>טלפון / וואטסאפ: <a href="https://wa.me/972546881116" dir="ltr">054-6881116</a> (טלי)</li>
        <li>דרך <Link to="/contact">טופס יצירת הקשר באתר</Link></li>
      </ul>

    </div>
  )
}

// English translation (26.10). The Hebrew text above is the binding version — keep the two in step.
function PrivacyEn() {
  return (
    <div className="legal">
      <h1>Privacy policy and terms</h1>
      <p className="updated">Lives of Others (registered non-profit 580754083) · Last updated: October 2026 · This is a translation; the Hebrew version is the binding one.</p>

      <div className="toc">
        <strong>Contents:</strong><br />
        <a href="#privacy">Privacy policy</a>
        <a href="#payments">Payments and security</a>
        <a href="#terms">Terms for donations and virtual adoption</a>
        <a href="#contact">Contact</a>
        <Link to="/en/accessibility">Accessibility statement</Link>
      </div>

      <h2 id="privacy">1. Privacy policy</h2>
      <p>Lives of Others (registered non-profit 580754083) ("the nonprofit", "we") respects the privacy of the users of this website. This policy explains what information is collected, how it is used and how we protect it.</p>

      <h3>1.1 What information we collect</h3>
      <ul>
        <li><strong>Information you give us voluntarily</strong> — when you fill in a form on the site (contact, virtual adoption, adoption as a gift): name (including the name for the receipt), phone, email address, how you heard about us, the content of your message, and for a gift — also the recipient's name, phone and email and your personal greeting. This information is <strong>kept in the nonprofit's management system</strong> and used by the nonprofit's team only.</li>
        <li><strong>Gift recipient details</strong> — when you give us the details of another person (a gift recipient), you declare that they agree to be contacted for delivering the gift and the updates.</li>
        <li><strong>Donation and payment details</strong> — payments are made and processed by the external payment provider <strong>Grow (by Meshulam)</strong>. Credit card details go directly to the payment provider and are not stored on the nonprofit's servers.</li>
        <li><strong>Technical information</strong> — the hosting servers keep technical access logs (such as IP address, browser type and the page opened) for security and operation only. The site does not run analytics or advertising tools.</li>
      </ul>

      <h3>1.2 How we use the information</h3>
      <ul>
        <li>Getting in touch and handling inquiries (adoption, volunteering, donations).</li>
        <li>Issuing receipts and donation confirmations, and managing sponsorships / virtual adoptions.</li>
        <li>Sending the adoption certificate, monthly updates from the dog and messages about the adoption / gift — by email or WhatsApp.</li>
        <li>Sending updates and marketing content — only if you ticked your consent, and you can unsubscribe at any time.</li>
        <li>Improving the service and the nonprofit's day-to-day operation.</li>
      </ul>

      <h3>1.3 Sharing information with third parties</h3>
      <p>We do not sell or pass on your information to third parties, except: (a) to service providers acting on our behalf and only to provide the service — the payment provider (Grow), the website hosting and database services (Vercel, Supabase — servers in the European Union) and the email service (Resend); (b) when required by law or by an order of a competent authority.</p>

      <h3>1.4 Cookies</h3>
      <p>The site itself does not use advertising, tracking or measurement cookies. Only simple preferences (such as the accessibility menu settings) are kept in your browser, and they are not sent to us. Videos and maps embedded from third parties (Facebook, YouTube, Waze, Google) may set their own cookies under their own privacy policies. You can block or delete cookies in your browser settings.</p>

      <h3>1.5 Your rights</h3>
      <p>Under the Israeli Protection of Privacy Law, 1981, you may review the information collected about you, ask for it to be corrected or deleted, and withdraw consent to mailings. For requests — see "Contact" below.</p>

      <h3>1.6 Information security</h3>
      <p>Information is kept as long as it is needed to manage the donation / adoption and to meet legal duties (such as keeping receipts), and is accessible only to the nonprofit's authorised team.</p>
      <p>We take reasonable measures to secure the information. However, complete protection cannot be guaranteed, and we are not responsible for damage caused by unauthorised access beyond our control.</p>

      <h2 id="payments">2. Payments and security</h2>
      <ul>
        <li>All payments on the site (donations, virtual adoption, adoption as a gift) are processed by the <strong>Grow</strong> payment system, which meets the <strong>PCI-DSS</strong> information-security standard.</li>
        <li>Supported payment methods may include credit card, Bit, PayBox and Google Pay (subject to availability in the payment system).</li>
        <li>After payment, a receipt / confirmation is sent to the email address you gave.</li>
        <li>The nonprofit does not store or see your credit card details.</li>
      </ul>

      <h2 id="terms">3. Terms for donations and virtual adoption</h2>
      <h3>3.1 Donations</h3>
      <p>Every donation to the nonprofit, whether a monthly standing order or a one-time donation, is a lifeline for the dogs and goes directly to funding boarding, life-saving medical care and food. Please note: the nonprofit operates without profit, but these donations are not recognised for tax purposes under section 46 of the Israeli Income Tax Ordinance. We thank you from the bottom of our hearts for being the dogs' guardian angel — your partnership is what lets us keep saving lives.</p>
      <p>A standing order can be cancelled at any time by contacting the nonprofit.</p>
      <h3>3.2 Virtual adoption / "My Guardian Angel"</h3>
      <p>A virtual adoption is a sponsorship that helps care for the chosen dog. <strong>The dog stays at the nonprofit's shelter</strong> and does not pass into the donor's possession. Several supporters may accompany the same dog together. The sponsorship does not grant ownership of, or legal rights in, the dog.</p>
      <h3>3.3 Adoption as a gift</h3>
      <p>A virtual adoption can be bought as a gift for another person. The recipient will get a message and a personal adoption certificate. We cannot commit to an exact delivery time in case of technical faults beyond our control.</p>
      <h3>3.4 Cancellations and refunds</h3>
      <p>Cancellation of a transaction follows the Israeli Consumer Protection Law, 1981. For cancellation or refund requests, contact the nonprofit using the details below.</p>
      <h3>3.5 Intellectual property</h3>
      <p>All content on the site (texts, photos, videos and logo) belongs to the nonprofit and may not be used without written permission.</p>

      <h2 id="contact">4. Contact</h2>
      <p>For any question about this policy, privacy or payments, you can reach us:</p>
      <ul>
        <li><strong>Lives of Others (registered non-profit 580754083)</strong></li>
        <li>Phone / WhatsApp: <a href="https://wa.me/972546881116" dir="ltr">+972-54-6881116</a> (Tali)</li>
        <li>Through <Link to="/en/contact">the contact form on the site</Link></li>
      </ul>
    </div>
  )
}
