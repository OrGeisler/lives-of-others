import type { FormEvent } from 'react'
import { WA_ADOPT, wa } from '../../lib/links'

const TOPICS = [
  'אני רוצה לאמץ כלב',
  'אני רוצה להתנדב',
  'אני רוצה להיות משפחת אומנה',
  'חסות חודשית / אימוץ וירטואלי',
  'עזרה בתחומים נוספים (שיווק / גיוס תרומות / שיפוץ)',
  'אחר',
]

// The form opens a ready WhatsApp message — nothing is stored on the site
export default function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = String(f.get('name') ?? '').trim()
    const phone = String(f.get('phone') ?? '').trim()
    const topic = String(f.get('topic') ?? '')
    const msg = String(f.get('message') ?? '').trim()
    const text = ['היי! הגעתי דרך האתר 🐾', `שם: ${name}`, phone && `טלפון: ${phone}`, `נושא: ${topic}`, msg && `פירוט: ${msg}`]
      .filter(Boolean)
      .join('\n')
    window.open(wa(WA_ADOPT, text), '_blank', 'noopener')
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <div className="contact-copy reveal">
          <h2>רוצים לאמץ? להתנדב?</h2>
          <p>מלאו את הפרטים ונחזור אליכם — או שלחו לנו הודעה ישירה בוואטסאפ. לפני כל אימוץ נערוך שיחת היכרות ושאלון התאמה, כדי לוודא שכל כלב מגיע לבית הנכון בשבילו.</p>
          <p>📍 רמת אפעל · ☎ טלי 054-6881116</p>
          <a className="btn-wa" href={wa(WA_ADOPT, 'היי! הגעתי דרך האתר 🐾')} target="_blank" rel="noopener">💬 דברו איתנו בוואטסאפ</a>
        </div>
        <form className="contact-form reveal" id="contact-form" onSubmit={onSubmit}>
          <input name="name" placeholder="שם מלא" aria-label="שם מלא" required />
          <input name="phone" placeholder="טלפון" aria-label="טלפון" type="tel" />
          <select name="topic" aria-label="נושא">
            {TOPICS.map(t => <option key={t}>{t}</option>)}
          </select>
          <textarea name="message" placeholder="ספרו לנו קצת..." aria-label="פירוט" rows={3}></textarea>
          <button type="submit">שליחה בוואטסאפ 💬</button>
          <p className="form-hint">הטופס נפתח כהודעת וואטסאפ מוכנה — לא נשמר שום מידע באתר.</p>
        </form>
      </div>
    </section>
  )
}
