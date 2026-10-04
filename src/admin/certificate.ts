import { supabase } from '../lib/supabase'

// Ask the server to render the certificate PDF and email it (staff JWT authorizes the call)
export async function sendCertificate(id: string, to?: 'recipient'): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  const res = await fetch('/api/send-certificate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token ?? ''}` },
    body: JSON.stringify({ id, to }),
  }).catch(() => null)
  if (!res) return 'אין חיבור לאינטרנט'
  if (res.ok) return null
  const body = await res.json().catch(() => ({}))
  if (res.status === 422) return to === 'recipient' ? 'למקבל/ת המתנה אין כתובת מייל — הוסיפו מייל ונסו שוב' : 'למאמץ אין כתובת מייל — הוסיפו מייל ונסו שוב'
  if (res.status === 404) return 'התעודה זמינה רק אחרי שהאימוץ פעיל / המתנה שולמה'
  return body.error ?? `שגיאה (${res.status})`
}
