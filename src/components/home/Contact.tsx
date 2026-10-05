import { useState, type FormEvent } from 'react'
import { WA_ADOPT, wa } from '../../lib/links'
import { supabase } from '../../lib/supabase'

const TOPICS = [
  'אני רוצה לאמץ כלב',
  'אני רוצה להתנדב',
  'אני רוצה להיות משפחת אומנה',
  'חסות חודשית / אימוץ וירטואלי',
  'עזרה בתחומים נוספים (שיווק / גיוס תרומות / שיפוץ)',
  'אחר',
]

// The form is saved in the admin (פניות) AND opens a ready WhatsApp message to Beri
export default function Contact() {
  const [sent, setSent] = useState(false)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const name = String(f.get('name') ?? '').trim()
    const phone = String(f.get('phone') ?? '').trim()
    const topic = String(f.get('topic') ?? '')
    const msg = String(f.get('message') ?? '').trim()
    const text = ['היי! הגעתי דרך האתר 🐾', `שם: ${name}`, phone && `טלפון: ${phone}`, `נושא: ${topic}`, msg && `פירוט: ${msg}`]
      .filter(Boolean)
      .join('\n')
    void supabase.from('contact_messages').insert({ name: name.slice(0, 80), phone: phone.slice(0, 20) || null, topic, message: msg.slice(0, 2000) || null })
    window.open(wa(WA_ADOPT, text), '_blank', 'noopener')
    setSent(true); form.reset()
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <div className="contact-copy reveal">
          <h2>רוצים לאמץ? להתנדב?</h2>
          <p>מלאו את הפרטים ונחזור אליכם — או שלחו לנו הודעה ישירה בוואטסאפ. לפני כל אימוץ נערוך שיחת היכרות ושאלון התאמה, כדי לוודא שכל כלב מגיע לבית הנכון בשבילו.</p>
          <p>📍 רמת אפעל · 💬 ברי <a href={wa(WA_ADOPT, 'היי! הגעתי דרך האתר 🐾')} dir="ltr" style={{ color: 'inherit' }}>052-8296622</a></p>
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
          {sent ? <p className="form-hint">✓ הפנייה התקבלה ונשמרה אצלנו — נחזור אליכם בהקדם.</p> : <p className="form-hint">הפנייה נשמרת אצלנו ונפתחת גם כהודעת וואטסאפ לברי. <a href="/privacy" style={{ color: 'inherit' }}>מדיניות פרטיות</a></p>}
        </form>
      </div>
    </section>
  )
}
