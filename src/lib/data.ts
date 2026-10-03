import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Counter, Dog, Fallen, TeamMember } from './types'

type State<T> = { data: T | null; error: string | null; loading: boolean }

function useQuery<T>(run: () => PromiseLike<{ data: unknown; error: { message: string } | null }>, deps: unknown[] = []): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true })
  useEffect(() => {
    let alive = true
    run().then(({ data, error }) => {
      if (alive) setState({ data: (data as T) ?? null, error: error?.message ?? null, loading: false })
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

export const useDogs = () =>
  useQuery<Dog[]>(() => supabase.from('dogs').select('*').eq('active', true).order('sort'))

export const useDog = (slug: string) =>
  useQuery<Dog>(() => supabase.from('dogs').select('*').eq('slug', slug).eq('active', true).maybeSingle(), [slug])

export const useFallen = () =>
  useQuery<Fallen[]>(() => supabase.from('fallen').select('*').eq('active', true).order('sort'))

export const useTeam = () =>
  useQuery<TeamMember[]>(() => supabase.from('team').select('*').eq('active', true).order('sort'))

export const useCounters = () =>
  useQuery<{ value: Counter[] }>(() => supabase.from('site_settings').select('value').eq('key', 'counters').maybeSingle())

export const useBirthdayDog = () => {
  const month = new Date().getMonth() + 1
  return useQuery<{ text: string | null; dogs: Dog | null }>(
    () => supabase.from('birthday_schedule').select('text, dogs(*)').eq('month', month).maybeSingle(),
    [month],
  )
}
