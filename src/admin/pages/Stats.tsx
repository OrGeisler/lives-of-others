import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Empty, Help, PageHead, toast } from '../ui'

// Site visit stats (12.11): our own anonymous counter (src/lib/track.ts → site_events), totals from site_stats().
type Stats = {
  days: number; visits: number; views: number; wa: number; pay: number; today: number; prev_visits: number; one_page: number
  inquiries: number; site_payments: number; site_sum: number
  daily: { day: string; visits: number; views: number }[]
  hours: { hour: number; visits: number }[]
  weekdays: { dow: number; visits: number }[]
  pages: { page: string; views: number }[]
  dogs: { name: string; slug: string; views: number }[]
  wa_pages: { page: string; clicks: number }[]
  sources: { source: string; visits: number }[]
  devices: { device: string; visits: number }[]
  langs: { lang: string; visits: number }[]
}

const SITE = 'https://lives-of-others.com'
const PAGES: Record<string, string> = {
  '/': 'עמוד הבית', '/dogs': 'הכלבים שלנו', '/about': 'עלינו', '/homes': 'בתים', '/volunteer': 'התנדבות',
  '/donate': 'תרומה', '/contact': 'צור קשר', '/virtual-adoption': 'אימוץ וירטואלי', '/gift-adoption': 'אימוץ במתנה',
  '/birthday': 'יום הולדת לכלב', '/checkout': 'טופס לפני תשלום', '/certificate': 'תעודת אימוץ (מהקישור ששלחנו)',
  '/birthday-thanks': 'איגרת תודה ליום הולדת', '/privacy': 'מדיניות פרטיות', '/accessibility': 'הצהרת נגישות',
}
const SOURCES: Record<string, string> = {
  direct: 'ישיר / וואטסאפ', facebook: 'פייסבוק', instagram: 'אינסטגרם', google: 'גוגל', whatsapp: 'וואטסאפ',
  bing: 'בינג', tiktok: 'טיקטוק', youtube: 'יוטיוב', x: 'X (טוויטר)', linkedin: 'לינקדאין', ai: 'צ\'אטבוטים (ChatGPT וכו\')',
  newsletter: 'ניוזלטר', sms: 'SMS',
}
const DEVICES: Record<string, string> = { phone: '📱 טלפון', desktop: '💻 מחשב', tablet: '📟 טאבלט' }
const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const LINKS = [
  ['instagram', 'אינסטגרם (קישור בביו / סטורי)'], ['facebook', 'פייסבוק'], ['whatsapp', 'קבוצות וסטטוס בוואטסאפ'],
  ['tiktok', 'טיקטוק'], ['newsletter', 'ניוזלטר / מייל'], ['sms', 'SMS'],
]

const pageName = (p: string, dogs: Stats['dogs']) => {
  const dog = p.match(/^\/(dogs|virtual-adoption)\/(.+)$/)
  if (dog) {
    const slug = decodeURIComponent(dog[2])
    return `${dog[1] === 'dogs' ? 'עמוד הכלב' : 'אימוץ וירטואלי של'} ${dogs.find(d => d.slug === slug)?.name ?? slug}`
  }
  return PAGES[p] ?? p
}
const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0)
const fmt = (n: number) => n.toLocaleString('he-IL')

function Bars<T>({ rows, label, value, max }: { rows: T[]; label: (r: T) => string; value: (r: T) => number; max?: number }) {
  const top = max ?? Math.max(1, ...rows.map(value))
  return (
    <div className="st-bars">
      {rows.map((r, i) => (
        <div key={i} className="st-bar-row">
          <span className="st-bar-label">{label(r)}</span>
          <span className="st-bar"><span style={{ width: `${Math.max(2, (value(r) / top) * 100)}%` }} /></span>
          <b className="st-bar-n">{fmt(value(r))}</b>
        </div>
      ))}
    </div>
  )
}

export default function Stats() {
  const [days, setDays] = useState(30)
  const [s, setS] = useState<Stats | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    setS(null)
    supabase.rpc('site_stats', { p_days: days }).then(({ data, error }) => {
      if (error) setErr(error.message); else setS(data as Stats)
    })
  }, [days])

  const copy = (src: string) => {
    navigator.clipboard?.writeText(`${SITE}/?utm_source=${src}`).then(() => toast('הקישור הועתק ✓'), () => toast('לא הצלחתי להעתיק', true))
  }

  // a full row per day, also for days with no visits
  const daily = s ? Array.from({ length: s.days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (s.days - 1 - i))
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' })
    return { key, label: d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' }), visits: s.daily.find(x => x.day === key)?.visits ?? 0 }
  }) : []
  const dailyMax = Math.max(1, ...daily.map(d => d.visits))
  const hours = s ? Array.from({ length: 24 }, (_, h) => ({ h, visits: s.hours.find(x => x.hour === h)?.visits ?? 0 })) : []
  const hoursMax = Math.max(1, ...hours.map(h => h.visits))
  const bestHour = hours.reduce((a, b) => (b.visits > a.visits ? b : a), { h: -1, visits: 0 })
  const bestDay = s?.weekdays.reduce((a, b) => (b.visits > a.visits ? b : a), { dow: -1, visits: 0 })
  const change = s && s.prev_visits ? Math.round(((s.visits - s.prev_visits) / s.prev_visits) * 100) : null
  const phone = s?.devices.find(d => d.device === 'phone')?.visits ?? 0
  const topSource = s?.sources[0]
  const topDog = s?.dogs[0]
  const en = s?.langs.find(l => l.lang === 'en')?.visits ?? 0

  return (
    <>
      <PageHead title="סטטיסטיקה של האתר">
        <div className="ad-tabs" style={{ margin: 0 }}>
          {[7, 30, 90].map(d => <button key={d} className={`ad-tab${days === d ? ' on' : ''}`} onClick={() => setDays(d)}>{d} ימים</button>)}
        </div>
      </PageHead>
      <Help>
        כמה אנשים נכנסים לאתר, מאיפה הם מגיעים ומה הם עושים בו. כל <b>ביקור</b> הוא כניסה אחת של אדם לאתר (גם אם עבר בכמה עמודים).
        הספירה אנונימית: בלי שמות, בלי עוגיות ובלי כתובות IP. הכניסות שלכם מהמחשב או הטלפון שמחוברים לניהול לא נספרות.
        הספירה התחילה ב-12.11.2026, אז בימים הראשונים המספרים עוד קטנים.
      </Help>

      {err ? <Empty>לא הצלחתי לטעון: {err}</Empty> : !s ? <p>טוען…</p> : s.visits === 0 ? (
        <Empty>עוד אין ביקורים בתקופה הזו. ברגע שאנשים ייכנסו לאתר, המספרים יופיעו כאן.</Empty>
      ) : (
        <>
          <div className="ad-cards st-cards">
            <div className="ad-card ok"><span className="ad-card-num">{fmt(s.visits)}</span><span className="ad-card-label">ביקורים באתר</span>
              <span className="ad-muted">{change === null ? `ב-${s.days} הימים האחרונים` : `${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}% לעומת ${s.days} הימים שלפני`}</span></div>
            <div className="ad-card"><span className="ad-card-num">{fmt(s.today)}</span><span className="ad-card-label">ביקורים היום</span></div>
            <div className="ad-card"><span className="ad-card-num">{fmt(s.views)}</span><span className="ad-card-label">עמודים שנצפו</span>
              <span className="ad-muted">בממוצע {(s.views / s.visits).toFixed(1)} עמודים לביקור</span></div>
            <div className="ad-card"><span className="ad-card-num">{fmt(s.wa)}</span><span className="ad-card-label">💬 לחיצות על וואטסאפ</span>
              <span className="ad-muted">פתחו שיחה עם העמותה מהאתר</span></div>
            <div className="ad-card"><span className="ad-card-num">{fmt(s.pay)}</span><span className="ad-card-label">💳 יציאות לדף תשלום</span>
              <span className="ad-muted">שולמו בפועל מדפי האתר: {fmt(s.site_payments)} ({fmt(Math.round(s.site_sum))} ₪)</span></div>
            <div className="ad-card"><span className="ad-card-num">{fmt(s.inquiries)}</span><span className="ad-card-label">📨 פניות בטופס</span></div>
          </div>

          <h2 className="ad-h2">✨ מה כדאי לדעת</h2>
          <ul className="st-insights">
            {topSource && <li>הכי הרבה ביקורים מגיעים מ<b>{SOURCES[topSource.source] ?? topSource.source}</b> ({pct(topSource.visits, s.visits)}%).</li>}
            {phone > 0 && <li><b>{pct(phone, s.visits)}%</b> מהגולשים נכנסים מהטלפון. כל דבר שמעלים לאתר כדאי לבדוק קודם בטלפון.</li>}
            {bestHour.h >= 0 && <li>השעה הכי עמוסה באתר: <b dir="ltr">{bestHour.h}:00–{bestHour.h + 1}:00</b>{bestDay && bestDay.dow >= 0 && <>, והיום הכי עמוס: <b>יום {DAYS[bestDay.dow]}</b></>}. זה זמן טוב לפרסם פוסט עם קישור לאתר.</li>}
            {topDog && <li>הכלב שהכי הרבה אנשים נכנסו לראות: <b>{topDog.name}</b> ({fmt(topDog.views)} צפיות). אולי כדאי לפרסם עליו עוד.</li>}
            {s.one_page > 0 && <li><b>{pct(s.one_page, s.visits)}%</b> מהמבקרים ראו עמוד אחד ויצאו. זה רגיל למי שמגיע מפוסט; קישור ישיר לעמוד של כלב מחזיק אנשים יותר.</li>}
            {en > 0 && <li><b>{fmt(en)}</b> ביקורים היו באתר באנגלית.</li>}
          </ul>

          <h2 className="ad-h2">ביקורים לפי יום</h2>
          <div className="st-days" style={{ gridTemplateColumns: `repeat(${daily.length}, 1fr)` }}>
            {daily.map(d => (
              <div key={d.key} className="st-day" title={`${d.label}: ${d.visits} ביקורים`}>
                <span className="st-day-bar" style={{ height: `${(d.visits / dailyMax) * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="st-days-axis"><span>{daily[0]?.label}</span><span>היום</span></div>

          <div className="st-grid">
            <section>
              <h2 className="ad-h2">מאיפה מגיעים</h2>
              <Bars rows={s.sources} label={r => SOURCES[r.source] ?? r.source} value={r => r.visits} />
              <p className="ad-muted">"ישיר / וואטסאפ" = הקלידו את הכתובת או לחצו על קישור בוואטסאפ (וואטסאפ לא מספר לאתרים מאיפה הגיעו).</p>
            </section>
            <section>
              <h2 className="ad-h2">🐶 הכלבים הכי נצפים</h2>
              {s.dogs.length ? <Bars rows={s.dogs} label={r => r.name} value={r => r.views} /> : <p className="ad-muted">עוד אין צפיות בעמודי כלבים.</p>}
            </section>
            <section>
              <h2 className="ad-h2">העמודים הכי נצפים</h2>
              <Bars rows={s.pages} label={r => pageName(r.page, s.dogs)} value={r => r.views} />
            </section>
            <section>
              <h2 className="ad-h2">💬 מאיפה לוחצים על וואטסאפ</h2>
              {s.wa_pages.length ? <Bars rows={s.wa_pages} label={r => pageName(r.page, s.dogs)} value={r => r.clicks} /> : <p className="ad-muted">עוד אין לחיצות.</p>}
            </section>
            <section>
              <h2 className="ad-h2">באיזו שעה נכנסים</h2>
              <div className="st-hours">
                {hours.map(h => <span key={h.h} title={`${h.h}:00 — ${h.visits}`} style={{ height: `${Math.max(3, (h.visits / hoursMax) * 100)}%` }} className={h.h === bestHour.h ? 'top' : ''} />)}
              </div>
              <div className="st-days-axis" dir="ltr"><span>0:00</span><span>12:00</span><span>23:00</span></div>
            </section>
            <section>
              <h2 className="ad-h2">טלפון או מחשב · עברית או אנגלית</h2>
              <Bars rows={s.devices} label={r => DEVICES[r.device] ?? r.device} value={r => r.visits} max={s.visits} />
              <Bars rows={s.langs} label={r => (r.lang === 'en' ? '🇬🇧 אנגלית' : '🇮🇱 עברית')} value={r => r.visits} max={s.visits} />
            </section>
          </div>
        </>
      )}

      <h2 className="ad-h2">🔗 קישורים חכמים לפרסום</h2>
      <Help>
        רוצים לדעת כמה אנשים הגיעו מאינסטגרם ולא מפייסבוק? כשמפרסמים קישור לאתר, מעתיקים מכאן את הקישור של אותו מקום.
        הוא מוביל לאותו אתר בדיוק, ובטבלת "מאיפה מגיעים" יופיע בנפרד. אפשר להוסיף את הסוף <b dir="ltr">?utm_source=instagram</b> גם לקישור של עמוד כלב.
      </Help>
      <div className="st-links">
        {LINKS.map(([src, label]) => (
          <button key={src} className="ad-btn ghost sm" onClick={() => copy(src)}>📋 {label}</button>
        ))}
      </div>
    </>
  )
}
