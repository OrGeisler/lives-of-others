import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DogLite } from './types'

export function useDogsLite() {
  const [dogs, setDogs] = useState<DogLite[]>([])
  useEffect(() => {
    supabase.from('dogs').select('id,slug,name,main_image,thanks_video_url').order('sort').then(({ data }) => setDogs(data ?? []))
  }, [])
  return dogs
}
