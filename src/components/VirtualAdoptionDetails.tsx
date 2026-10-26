import { Link } from 'react-router-dom'
import { TIERS } from '../lib/constants'
import { useLang } from '../lib/lang'

// The virtual-adoption details shared by the home page and /virtual-adoption (24.9 items 8.3–8.4):
// three "+" accordions, then the monthly tiers as info cards (not payment buttons). Hebrew + English (26.10).

const FIT: [string, string, string][] = [
  ['🏠', 'הבית כבר מלא — יש לכם כבר כלב (או שלושה...), הלב רוצה להציל עוד נשמה, אבל אין יותר מקום על הספה.', "Your home is already full — you have a dog (or three…) and your heart wants to save another soul, but there's no more room on the couch."],
  ['💚', 'פשוט בא לכם לעשות מעשה טוב, ולדעת שבזכותכם כלב אחד ישן הלילה שבע, רגוע ומטופל.', 'You simply want to do a good deed, and know that thanks to you one dog sleeps tonight full, calm and cared for.'],
  ['🐱', 'יש לכם חתול שליט בבית שלא מוכן לשמוע על שותף חדש עם נביחות.', "You have a cat who rules the house and won't hear of a new roommate who barks."],
  ['✈️', 'אתם טסים הרבה, עובדים שעות ארוכות, או בתקופה שבה גידול כלב בבית הוא אחריות גדולה מדי.', 'You travel a lot, work long hours, or are in a period when raising a dog at home is too big a responsibility.'],
  ['🧑‍🎓', 'אתם בני נוער שחולמים על כלב משלכם — אבל ההורים עדיין לא השתכנעו שזה הזמן.', "You're teenagers dreaming of a dog of your own — but your parents aren't convinced yet that it's time."],
  ['🎁', 'מחפשים מתנה מיוחדת עם משמעות? רוצים להפתיע ולרגש אדם קרוב? הנה ההזדמנות!', "Looking for a special, meaningful gift? Want to surprise and move someone close to you? Here's your chance!"],
]

const BASKET: [string, string, string][] = [
  ['📜', 'תעודת אימוץ אישית של "המלאך השומר שלי" הנושאת את שמכם — תישלח אליכם לטלפון בהודעת וואטסאפ, עם תמונה של הכלב שאימצתם.', 'A personal "My Guardian Angel" adoption certificate with your name — sent to your phone on WhatsApp, with a photo of the dog you adopted.'],
  ['📸', 'פעם בחודש תקבלו עדכון אישי מהכלב האהוב שבחרתם, יחד עם תמונות וסרטונים שימיסו לכם את הלב.', 'Once a month, a personal update from the dog you chose, with photos and videos that will melt your heart.'],
  ['🐾', 'הוא כבר מכשכש בזנב 😊 — מוזמנים לבוא לבקר אותו ולצאת לטיול משותף (אל תשכחו לתאם איתנו מראש).', "They're already wagging their tail 😊 — you're welcome to visit and go for a walk together (please coordinate with us in advance)."],
]


const Li = ({ ico, text }: { ico: string; text: string }) => (
  <li><span>{ico}</span><span>{text}</span></li>
)

// whatIs: the extra "+" that the per-dog virtual-adoption page opens with (24.9 item 8, discussion)
export function VaAccordions({ whatIs = false }: { whatIs?: boolean }) {
  const { en, t, to, arrow } = useLang()
  return (
    <div className="acc reveal">
      {whatIs && (
        <details>
          <summary>{t('מה זה בעצם "להיות המלאך השומר שלי – אימוץ וירטואלי"?', 'What exactly is "Be my guardian angel – virtual adoption"?')}</summary>
          <div className="acc-body">
            <p>{t('ישנם כלבים שהדרך שלהם לבית קבוע ארוכה יותר. חלקם נמצאים איתנו חודשים וחלקם אף שנים ארוכות. עבורם הקמנו את תוכנית "המלאך השומר שלי".', 'Some dogs have a longer road to a permanent home. Some stay with us for months, some for years. For them we created the "My Guardian Angel" program.')}</p>
            <p>{t('זו הדרך שלכם להפוך למלאכים השומרים של כלב שזקוק לכם — לדעת שיש לכם חבר על ארבע שמחכה לכם וזוכה לחיים טובים בזכותכם.', "It's your way to become the guardian angel of a dog who needs you — knowing there's a four-legged friend waiting for you, living a good life thanks to you.")}</p>
            <p>{t('באימוץ וירטואלי אתם בוחרים כלב מסוים ומלווים אותו מקרוב בחסות חודשית קבועה, עד שימצא בית של ממש.', 'In a virtual adoption you choose a specific dog and accompany them closely with a fixed monthly sponsorship, until they find a real home.')}</p>
          </div>
        </details>
      )}
      <details>
        <summary>{t('למי זה מתאים?', 'Who is it for?')}</summary>
        <div className="acc-body"><ul>{FIT.map(([i, he, e]) => <Li key={i} ico={i} text={en ? e : he} />)}</ul></div>
      </details>
      <details>
        <summary>{t('איך זה עובד?', 'How does it work?')}</summary>
        <div className="acc-body">
          <div className="acc-steps">
            <div><b>{t('1. בוחרים כלב', '1. Choose a dog')}</b>{t('נכנסים לגלריית הכלבים, מתאהבים, ובוחרים את מי שתרצו ללוות.', 'Browse the dogs, fall in love, and pick the one you want to accompany.')}</div>
            <div><b>{t('2. קובעים חסות חודשית', '2. Set a monthly sponsorship')}</b>{t('סכום קבוע לבחירתכם (הוראת קבע) שמכסה אוכל, חיסונים וטיפול.', 'A fixed amount of your choice (standing order) that covers food, vaccines and care.')}</div>
            <div><b>{t('3. מלווים מקרוב', '3. Stay close')}</b>{t('מקבלים עדכונים, תמונות וסרטונים — ורואים איך הכלב שלכם פורח.', 'Get updates, photos and videos — and watch your dog thrive.')}</div>
          </div>
          <Link to={to('/virtual-adoption#choose')} className="btn btn-sm btn-orange" style={{ marginTop: 14 }}>{t('לבחירת כלב', 'Choose a dog')} {arrow}</Link>
        </div>
      </details>
      <details>
        <summary>{t('מה כולל סל האימוץ הווירטואלי?', "What's included in the virtual adoption?")}</summary>
        <div className="acc-body"><ul>{BASKET.map(([i, he, e]) => <Li key={i} ico={i} text={en ? e : he} />)}</ul></div>
      </details>
    </div>
  )
}

export function VaTiers() {
  const { en, t } = useLang()
  return (
    <div className="tiers-info reveal">
      {TIERS.map(x => (
        <div className={`tier-card${x.featured ? ' featured' : ''}`} key={x.amt}>
          <div className="tc-ico">{x.ico}</div>
          <div className="tc-amt">{t(`${x.amt} ₪`, `₪${x.amt}`)} <small>{t('/ חודש', '/ month')}</small></div>
          {x.featured && <span className="tc-badge">{t('הכי פופולרי', 'Most popular')}</span>}
          <p>{en ? x.descEn : x.desc}</p>
        </div>
      ))}
    </div>
  )
}

// Home-page layout: accordions, tiers heading, tier cards.
export default function VirtualAdoptionDetails() {
  const { t } = useLang()
  return (
    <>
      <VaAccordions />
      <h3 className="va-home-tiers-h reveal">{t('מסלולי החסות החודשית', 'Monthly sponsorship options')}</h3>
      <VaTiers />
    </>
  )
}
