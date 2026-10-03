import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Help, PageHead } from '../ui'
import { HE_MONTHS, monthStart, shekel } from '../util'

type Stats = { active: number; monthly: number; toSend: number; giftsToday: number; review: number; failed: number; bday: string | null }

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null)
  useEffect(() => {
    (async () => {
      const period = monthStart()
      const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999)
      const [sp, logs, gifts, pay, bd] = await Promise.all([
        supabase.from('sponsorships').select('id,tier,status'),
        supabase.from('updates_log').select('sponsorship_id').eq('period', period).not('sponsorship_id', 'is', null),
        supabase.from('gifts').select('id').is('sent_at', null).neq('status', 'canceled').lte('send_at', endOfToday.toISOString()),
        supabase.from('payments').select('id').eq('needs_review', true),
        supabase.from('birthday_schedule').select('dogs(name)').eq('month', new Date().getMonth() + 1).maybeSingle(),
      ])
      const all = sp.data ?? []
      const active = all.filter(x => x.status === 'active')
      const sent = new Set((logs.data ?? []).map(l => l.sponsorship_id))
      setS({
        active: active.length,
        monthly: active.reduce((a, x) => a + (x.tier ?? 0), 0),
        toSend: active.filter(x => !sent.has(x.id)).length,
        giftsToday: gifts.data?.length ?? 0,
        review: pay.data?.length ?? 0,
        failed: all.filter(x => x.status === 'failed').length,
        bday: (bd.data?.dogs as unknown as { name: string } | null)?.name ?? null,
      })
    })()
  }, [])

  const month = HE_MONTHS[new Date().getMonth()]
  return (
    <>
      <PageHead title="שלום 👋" />
      <Help>זה המסך הראשי. הכרטיסים הצבעוניים מראים <b>מה מחכה לטיפול</b>. לחיצה על כרטיס מעבירה למסך המתאים.</Help>
      {!s ? <p>טוען…</p> : (
        <div className="ad-cards">
          <Link to="/admin/to-send" className={`ad-card${s.toSend ? ' alert' : ' ok'}`}>
            <span className="ad-card-num">{s.toSend}</span>
            <span className="ad-card-label">מאמצים שעוד לא קיבלו עדכון ב{month}</span>
            <span className="ad-card-go">{s.toSend ? 'לשליחת עדכונים ←' : 'הכל נשלח החודש ✓'}</span>
          </Link>
          <Link to="/admin/gifts" className={`ad-card${s.giftsToday ? ' alert' : ' ok'}`}>
            <span className="ad-card-num">{s.giftsToday}</span>
            <span className="ad-card-label">מתנות שצריך לשלוח היום</span>
            <span className="ad-card-go">{s.giftsToday ? 'למתנות ←' : 'אין מתנות לשליחה ✓'}</span>
          </Link>
          {s.review > 0 && (
            <Link to="/admin/payments" className="ad-card alert">
              <span className="ad-card-num">{s.review}</span>
              <span className="ad-card-label">תשלומים חדשים שצריך לשייך</span>
              <span className="ad-card-go">לתשלומים ←</span>
            </Link>
          )}
          {s.failed > 0 && (
            <Link to="/admin/sponsors?status=failed" className="ad-card alert">
              <span className="ad-card-num">{s.failed}</span>
              <span className="ad-card-label">הוראות קבע שהחיוב שלהן נכשל</span>
              <span className="ad-card-go">לבדיקה ←</span>
            </Link>
          )}
          <Link to="/admin/sponsors" className="ad-card">
            <span className="ad-card-num">{s.active}</span>
            <span className="ad-card-label">מאמצים וירטואליים פעילים</span>
            <span className="ad-card-go">{shekel(s.monthly)} בחודש</span>
          </Link>
          <Link to="/admin/birthdays" className="ad-card bday">
            <span className="ad-card-num">🎂</span>
            <span className="ad-card-label">יום ההולדת של {month}</span>
            <span className="ad-card-go">{s.bday ?? 'לא נבחר כלב — לבחירה ←'}</span>
          </Link>
        </div>
      )}
    </>
  )
}
