import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DogLite } from './types'

export function useDogsLite() {
  const [dogs, setDogs] = useState<DogLite[]>([])
  useEffect(() => {
    supabase.from('dogs').select('id,slug,name,main_image').order('sort').then(({ data }) => setDogs(data ?? []))
  }, [])
  return dogs
}
