import { Link } from 'react-router-dom'

// The virtual-adoption details shared by the home page and /virtual-adoption (24.9 items 8.3–8.4):
// three "+" accordions, then the monthly tiers as info cards (not payment buttons).

const FIT: [string, string][] = [
  ['🏠', 'הבית כבר מלא — יש לכם כבר כלב (או שלושה...), הלב רוצה להציל עוד נשמה, אבל אין יותר מקום על הספה.'],
  ['💚', 'פשוט בא לכם לעשות מעשה טוב, ולדעת שבזכותכם כלב אחד ישן הלילה שבע, רגוע ומטופל.'],
  ['🐱', 'יש לכם חתול שליט בבית שלא מוכן לשמוע על שותף חדש עם נביחות.'],
  ['✈️', 'אתם טסים הרבה, עובדים שעות ארוכות, או בתקופה שבה גידול כלב בבית הוא אחריות גדולה מדי.'],
  ['🧑‍🎓', 'אתם בני נוער שחולמים על כלב משלכם — אבל ההורים עדיין לא השתכנעו שזה הזמן.'],
  ['🎁', 'מחפשים מתנה מיוחדת עם משמעות? רוצים להפתיע ולרגש אדם קרוב? הנה ההזדמנות!'],
]

const BASKET: [string, string][] = [
  ['📜', 'תעודת אימוץ אישית של "המלאך השומר שלי" הנושאת את שמכם — תישלח אליכם למייל עם תמונה של הכלב שאימצתם.'],
  ['📸', 'פעם בחודש תקבלו עדכון אישי מהכלב האהוב שבחרתם, יחד עם תמונות וסרטונים שימיסו לכם את הלב.'],
  ['🐾', 'הוא כבר מכשכש בזנב 😊 — מוזמנים לבוא לבקר אותו ולצאת לטיול משותף (אל תשכחו לתאם איתנו מראש).'],
]

const TIERS = [
  { ico: '🦴', amt: 25, desc: 'תמיכה באוכל איכותי וחטיפים שהכלבים הכי אוהבים' },
  { ico: '💉', amt: 50, desc: 'תמיכה באוכל איכותי, חיסונים בשגרה וטיפולים רפואיים', featured: true },
  { ico: '🏡', amt: 100, desc: 'תמיכה באוכל איכותי, טיפולים רפואיים מצילי חיים ותחזוקת מתחם בית המחסה' },
]

const Li = ({ ico, text }: { ico: string; text: string }) => (
  <li><span>{ico}</span><span>{text}</span></li>
)

export function VaAccordions() {
  return (
    <div className="acc reveal">
      <details>
        <summary>למי זה מתאים?</summary>
        <div className="acc-body"><ul>{FIT.map(([i, t]) => <Li key={i} ico={i} text={t} />)}</ul></div>
      </details>
      <details>
        <summary>איך זה עובד?</summary>
        <div className="acc-body">
          <div className="acc-steps">
            <div><b>1. בוחרים כלב</b>נכנסים לגלריית הכלבים, מתאהבים, ובוחרים את מי שתרצו ללוות.</div>
            <div><b>2. קובעים חסות חודשית</b>סכום קבוע לבחירתכם (הוראת קבע) שמכסה אוכל, חיסונים וטיפול.</div>
            <div><b>3. מלווים מקרוב</b>מקבלים עדכונים, תמונות וסרטונים — ורואים איך הכלב שלכם פורח.</div>
          </div>
          <Link to="/#dogs" className="btn btn-sm btn-orange" style={{ marginTop: 14 }}>הכלבים שלנו ←</Link>
        </div>
      </details>
      <details>
        <summary>מה כולל סל האימוץ הווירטואלי?</summary>
        <div className="acc-body"><ul>{BASKET.map(([i, t]) => <Li key={i} ico={i} text={t} />)}</ul></div>
      </details>
    </div>
  )
}

export function VaTiers() {
  return (
    <div className="tiers-info reveal">
      {TIERS.map(t => (
        <div className={`tier-card${t.featured ? ' featured' : ''}`} key={t.amt}>
          {t.featured && <span className="tc-badge">הכי פופולרי</span>}
          <div className="tc-ico">{t.ico}</div>
          <div className="tc-amt">{t.amt} ₪ <small>/ חודש</small></div>
          <p>{t.desc}</p>
        </div>
      ))}
    </div>
  )
}

// Home-page layout: accordions, tiers heading, tier cards.
export default function VirtualAdoptionDetails() {
  return (
    <>
      <VaAccordions />
      <h3 className="va-home-tiers-h reveal">מסלולי החסות החודשית</h3>
      <VaTiers />
    </>
  )
}
