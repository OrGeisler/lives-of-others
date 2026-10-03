// Israeli phone → international digits for wa.me (0521234567 → 972521234567)
export function waPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  let d = phone.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = '972' + d.slice(1)
  return d.length >= 11 ? d : null
}
export const waLink = (phone: string | null | undefined, text: string) => {
  const p = waPhone(phone)
  return p ? `https://wa.me/${p}?text=${encodeURIComponent(text)}` : null
}
export const monthStart = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
export const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
export const fmtDate = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString('he-IL') : '—')
export const shekel = (n: number | null | undefined) => (n == null ? '—' : `${Number(n).toLocaleString('he-IL')} ₪`)
export const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9֐-׿]+/g, '-').replace(/^-|-$/g, '') || `dog-${Date.now()}`
