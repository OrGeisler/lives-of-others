import { useCounters } from '../../lib/data'
import { DONATE_URL, WA_TALI, wa } from '../../lib/links'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import '../../styles/donate.css'
import { useLang } from '../../lib/lang'

// Faces framed by eye (same set as the Grow cover)
const DOGS: [string, string][] = [
  ['/assets/img/dog-shuki-1.jpg', '50% 18%'], ['/assets/img/dog-micha-1.jpg', '50% 25%'], ['/assets/img/dog-pil-1.jpg', '50% 12%'],
  ['/assets/img/dog-gili-2.jpg', '50% 25%'], ['/assets/img/dog-bella-3.jpg', '50% 22%'],
]

export default function DonatePage() {
  useTitle('תרומה — חיים של אחרים', 'Donate — Lives of Others')
  const { t, arrow } = useLang()
  const num = (v: number) => v.toLocaleString(t('he-IL', 'en-US'))
  const counters = useCounters().data?.value ?? []
  const n = (label: string) => counters.find(c => c.label.includes(label))
  const dogs = n('בחסותנו'), costs = n('עלויות'), saved = n('שהצלנו')

  return (
    <>
      <section className="dn-hero">
        <div className="dn-strip" aria-hidden="true">
          {DOGS.map(([src, pos]) => <img key={src} src={src} alt="" style={{ objectPosition: pos }} />)}
        </div>
        <div className="dn-hero-text">
          <span className="dn-kicker">{t('כל תרומה מצילה חיים', 'Every donation saves lives')}</span>
          <h1>{t('הם מחכים לכם 🐾', "They're waiting for you 🐾")}</h1>
          <p>{t('מאחורי כל זוג עיניים כאן יש סיפור של נטישה — ושל הצלה. התרומה שלכם היא האוכל, הטיפול והבית שלהם, כל יום מחדש.', 'Behind every pair of eyes here is a story of abandonment — and of rescue. Your donation is their food, their care and their home, every single day.')}</p>
          <div className="dn-cta">
            <a className="btn dn-main" href={DONATE_URL} target="_blank" rel="noopener">{t('לתרומה מאובטחת ❤', 'Donate securely ❤')}</a>
          </div>
        </div>
      </section>

      {(dogs || costs) && (
        <section className="dn-facts">
          {saved && <div><b>{num(saved.value)}</b><span>{t('כלבים שהצלנו מאז 2016', 'Dogs we have rescued since 2016')}</span></div>}
          {dogs && <div><b>{num(dogs.value)}</b><span>{t('כלבים בחסותנו היום', 'Dogs in our care today')}</span></div>}
          {costs && <div><b>{num(costs.value)}{costs.suffix}</b><span>{t('עולה לנו כל חודש להחזיק את בתי המחסה', 'What it costs us every month to run the shelters')}</span></div>}
          <p className="dn-facts-note">{t('אנחנו עמותה על טהרת ההתנדבות — קיומנו תלוי אך ורק בתרומות.', 'We are run entirely by volunteers — we exist only thanks to donations.')}</p>
        </section>
      )}

      <section className="dn-ways">
        <h2>{t('כל הדרכים לתרום', 'All the ways to donate')}</h2>
        <div className="dn-ways-grid">
          <div className="dn-way">
            <h3>{t('💳 אשראי — חד-פעמי או הוראת קבע', '💳 Credit card — one-time or monthly')}</h3>
            <p>{t('תרומה מאובטחת בכרטיס אשראי או בביט, עם קבלה למייל.', 'A secure donation by credit card or Bit, with a receipt by email.')}</p>
            <a className="dn-link" href={DONATE_URL} target="_blank" rel="noopener">{t('לדף התרומה המאובטח', 'To the secure donation page')} {arrow}</a>
          </div>
          <div className="dn-way">
            <h3>{t('📱 ביט / פייבוקס', '📱 Bit / PayBox (Israel)')}</h3>
            <p>{t('ביט:', 'Bit:')} <b dir="ltr">052-8296622</b><br />{t('פייבוקס:', 'PayBox:')} <b dir="ltr">054-6881116</b></p>
            <a className="dn-link" href="https://links.payboxapp.com/mr8NxOzWKUb" target="_blank" rel="noopener">{t('לתשלום בפייבוקס', 'Pay with PayBox')} {arrow}</a>
          </div>
          <div className="dn-way">
            <h3>{t('🏦 העברה בנקאית', '🏦 Bank transfer')}</h3>
            {t(<p>למוטב: <b>חיים של אחרים</b><br />בנק מזרחי טפחות (20) · סניף כנפי נשרים (539)<br />חשבון: <b>497218</b></p>,
              <p>Beneficiary: <b>Lives of Others</b><br />Mizrahi-Tefahot Bank (20) · Kanfei Nesharim branch (539)<br />Account: <b>497218</b></p>)}
          </div>
          <div className="dn-way">
            <h3>{t('🌍 מחו"ל — PayPal', '🌍 From abroad — PayPal')}</h3>
            <p>{t('לתורמים מחוץ לישראל, מהיר ומאובטח.', 'For donors outside Israel — fast and secure.')}</p>
            <a className="dn-link" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">paypal.me/savingthedogs {arrow}</a>
          </div>
          <div className="dn-way">
            <h3>{t('💵 מזומן / המחאה', '💵 Cash / cheque')}</h3>
            <p>{t('לתרומה במזומן או בהמחאה צרו קשר עם טלי:', 'To donate in cash or by cheque, contact Tali:')} <b dir="ltr">054-6881116</b></p>
            <a className="dn-link" href={wa(WA_TALI, t('היי טלי, אני רוצה לתרום במזומן / בהמחאה לעמותת חיים של אחרים', "Hi Tali, I'd like to donate to Lives of Others in cash / by cheque"))} target="_blank" rel="noopener">{t('לשיחה עם טלי בוואטסאפ', 'Message Tali on WhatsApp')} {arrow}</a>
          </div>
        </div>
      </section>

    </>
  )
}
