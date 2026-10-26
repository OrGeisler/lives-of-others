import type { Dog } from './types'

// 13.10: "בן 8" / "בת 3 וחצי" instead of "8 שנים". Text already starting with בן/בת/בני is kept as typed.
export function ageLabel(d: Pick<Dog, 'age_text' | 'sex'>): string {
  const a = (d.age_text ?? '').trim()
  if (!a) return ''
  if (/^(בן|בת|בני|בנות)\s/.test(a)) return a
  const short = a.replace(/^(\d+) שנים( וחצי)?$/, '$1$2') // "8 שנים" → "8", "3 שנים וחצי" → "3 וחצי"
  return `${d.sex === 'f' ? 'בת' : 'בן'} ${short}`
}

// English pages: the age as staff typed it in English (dogs.age_en, e.g. "3 years"), else nothing
export function ageLabelEn(d: Pick<Dog, 'age_en'>): string {
  return (d.age_en ?? '').trim()
}
