import { useState, type FormEvent } from 'react'
import { WA_ADOPT, wa } from '../../lib/links'
import { sendContact } from '../../lib/contact'
import { useLang } from '../../lib/lang'
import { WA_HELLO } from '../Layout'

const TOPICS: [string, string][] = [
  ['אני רוצה לאמץ כלב', 'I want to adopt a dog'],
  ['אני רוצה להתנדב', 'I want to volunteer'],
  ['אני רוצה להיות משפחת אומנה', 'I want to be a foster family'],
  ['חסות חודשית / אימוץ וירטואלי', 'Monthly sponsorship / virtual adoption'],
  ['עזרה בתחומים נוספים (שיווק / גיוס תרומות / שיפוץ)', 'Help in other areas (marketing / fundraising / renovation)'],
  ['אחר', 'Other'],
]

// The form is saved in the admin (פניות), emailed to the staff, AND opens a ready WhatsApp message to Beri.
// English inquiries are tagged [EN] for the staff, with the topic in Hebrew so the inbox stays readable.
export default function Contact() {
  const [sent, setSent] = useState(false)
  const { en, t, to } = useLang()
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const name = String(f.get('name') ?? '').trim()
    const phone = String(f.get('phone') ?? '').trim()
    const i = Number(f.get('topic') ?? 0)
    const [topicHe, topicEn] = TOPICS[i] ?? TOPICS[0]
    const msg = String(f.get('message') ?? '').trim()
    const text = (en
      ? ["Hi! I'm reaching out via the website 🐾", `Name: ${name}`, phone && `Phone: ${phone}`, `Topic: ${topicEn}`, msg && `Details: ${msg}`]
      : ['היי! הגעתי דרך האתר 🐾', `שם: ${name}`, phone && `טלפון: ${phone}`, `נושא: ${topicHe}`, msg && `פירוט: ${msg}`])
      .filter(Boolean)
      .join('\n')
    void sendContact({ name, phone, topic: en ? `[EN] ${topicHe}` : topicHe, message: msg })
    window.open(wa(WA_ADOPT, text), '_blank', 'noopener')
    setSent(true); form.reset()
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <div className="contact-copy reveal">
          <h2>{t('רוצים לאמץ? להתנדב?', 'Want to adopt? Volunteer?')}</h2>
          <p>{t('מלאו את הפרטים ונחזור אליכם — או שלחו לנו הודעה ישירה בוואטסאפ. לפני כל אימוץ נערוך שיחת היכרות ושאלון התאמה, כדי לוודא שכל כלב מגיע לבית הנכון בשבילו.', "Fill in your details and we'll get back to you — or send us a message directly on WhatsApp. Before every adoption we hold an introductory conversation and a compatibility questionnaire, to make sure every dog goes to the right home for them.")}</p>
          <p>{t('📍 רמת אפעל · 💬 ברי', '📍 Ramat Efal · 💬 Beri')} <a href={wa(WA_ADOPT, WA_HELLO(en))} dir="ltr" style={{ color: 'inherit' }}>{t('052-8296622', '+972-52-829-6622')}</a></p>
          <a className="btn-wa" href={wa(WA_ADOPT, WA_HELLO(en))} target="_blank" rel="noopener">{t('💬 דברו איתנו בוואטסאפ', '💬 Chat with us on WhatsApp')}</a>
        </div>
        <form className="contact-form reveal" id="contact-form" onSubmit={onSubmit}>
          <input name="name" placeholder={t('שם מלא', 'Full name')} aria-label={t('שם מלא', 'Full name')} required />
          <input name="phone" placeholder={t('טלפון', 'Phone')} aria-label={t('טלפון', 'Phone')} type="tel" required pattern="[0-9+\-\s\(\)]{9,20}" title={t('מספר טלפון, כדי שנוכל לחזור אליכם', 'Phone number, so we can get back to you')} />
          <select name="topic" aria-label={t('נושא', 'Topic')}>
            {TOPICS.map(([he, enT], i) => <option key={he} value={i}>{en ? enT : he}</option>)}
          </select>
          <textarea name="message" placeholder={t('ספרו לנו קצת...', 'Tell us a little...')} aria-label={t('פירוט', 'Details')} rows={3}></textarea>
          <button type="submit">{t('שליחה בוואטסאפ 💬', 'Send on WhatsApp 💬')}</button>
          {sent
            ? <p className="form-hint">{t('✓ הפנייה נשמרה אצלנו ונחזור אליכם בהקדם. אם נפתח וואטסאפ, לחצו שם על "שליחה" כדי שההודעה תגיע גם לברי.', '✓ We received your message and will get back to you soon. If WhatsApp opened, tap "Send" there so it reaches Beri directly too.')}</p>
            : <p className="form-hint">{t('הפנייה נשמרת אצלנו ונפתחת גם כהודעת וואטסאפ לברי.', 'We receive your message, and it also opens as a ready WhatsApp message to Beri.')} <a href={to('/privacy')} style={{ color: 'inherit' }}>{t('מדיניות פרטיות', 'Privacy policy')}</a></p>}
        </form>
      </div>
    </section>
  )
}
