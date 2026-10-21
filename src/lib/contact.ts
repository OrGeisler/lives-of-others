import { supabase } from './supabase'

type Row = { name: string; phone: string; topic: string; message: string }

// Contact form → /api/contact (saves to פניות + emails the staff). If the API is down, save directly so nothing is lost.
export function sendContact(r: Row) {
  return fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
    .then(res => { if (!res.ok) throw new Error(String(res.status)) })
    .catch(() => supabase.from('contact_messages')
      .insert({ name: r.name.slice(0, 80), phone: r.phone.slice(0, 20) || null, topic: r.topic.slice(0, 80), message: r.message.slice(0, 2000) || null })
      .then(({ error }) => { if (error) console.error('contact save failed', error.message) }))
}
