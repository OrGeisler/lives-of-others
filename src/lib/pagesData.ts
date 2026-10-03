import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Dog } from './types'

export function useTitle(title: string) {
  useEffect(() => { document.title = title }, [title])
}

// Order requested in the 24.9 doc for the gift page
const GIFT_ORDER = ['micha', 'cooper', 'gili', 'junior', 'pil', 'shuki']

export function useGiftDogs() {
  const [dogs, setDogs] = useState<Dog[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    supabase.from('dogs').select('*').eq('available_for_gift', true).eq('active', true).then(({ data, error }) => {
      if (!alive) return
      if (error) { setError(error.message); return }
      const rank = (s: string) => { const i = GIFT_ORDER.indexOf(s); return i === -1 ? 99 : i }
      setDogs(((data ?? []) as Dog[]).sort((a, b) => rank(a.slug) - rank(b.slug) || a.sort - b.sort))
    })
    return () => { alive = false }
  }, [])
  return { dogs, error }
}

/** Month from ?month=1..12 (for previewing other months), else the current month. */
export function monthFromQuery(search: string): number {
  const q = parseInt(new URLSearchParams(search).get('month') ?? '', 10)
  return q >= 1 && q <= 12 ? q : new Date().getMonth() + 1
}

/** The birthday dog for a month (from birthday_schedule), or a specific dog by slug when given. */
export function useBirthdayDogFor(month: number, slug?: string | null) {
  const [dog, setDog] = useState<Dog | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    type Row = { text: string | null; dogs: Dog | null } | null
    const byMonth = () => supabase.from('birthday_schedule').select('text, dogs(*)').eq('month', month).maybeSingle()
      .then(r => { const row = r.data as Row; return { d: row?.dogs?.active ? row.dogs : null, t: row?.text ?? null } })
    const run = slug
      ? supabase.from('dogs').select('*').eq('slug', slug).eq('active', true).maybeSingle()
          .then(r => (r.data ? { d: r.data as Dog, t: null } : byMonth())) // unknown slug → fall back to the month's dog
      : byMonth()
    Promise.resolve(run).then(({ d, t }) => { if (alive) { setDog(d); setText(t); setLoading(false) } })
    return () => { alive = false }
  }, [month, slug])
  return { dog, text, loading }
}
