import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { GROW_BIRTHDAY, GROW_GIFT, GROW_TEST, GROW_VIRTUAL } from './links'

export type PayLinks = { grow_virtual: string; grow_gift: string; grow_birthday: string; grow_test: string }
const FALLBACK: PayLinks = { grow_virtual: GROW_VIRTUAL, grow_gift: GROW_GIFT, grow_birthday: GROW_BIRTHDAY, grow_test: GROW_TEST }

// Grow payment links are edited in the admin (תוכן האתר → קישורי תשלום); the checkout function reads the same row.
export function usePayLinks(): PayLinks {
  const [links, setLinks] = useState<PayLinks>(FALLBACK)
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'links').maybeSingle()
      .then(({ data }) => { if (data?.value) setLinks({ ...FALLBACK, ...(data.value as Partial<PayLinks>) }) })
  }, [])
  return links
}
