import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Dog } from './types'

export { GIFT_SUM } from './constants'

export function useVirtualDogs() {
  const [dogs, setDogs] = useState<Dog[] | null>(null)
  useEffect(() => {
    supabase.from('dogs').select('*').eq('available_for_virtual', true).eq('active', true).order('sort')
      .then(({ data, error }) => setDogs(error ? [] : ((data ?? []) as Dog[])))
  }, [])
  return dogs
}

export type CheckoutPayload = {
  type: 'virtual' | 'gift'; dog: string; tier?: number
  honor_name: string; phone: string; email: string; source: string
  consent_terms: boolean; consent_marketing: boolean; website: string
  gift?: { name: string; phone: string; email: string; greeting: string; send_at: string }
}

// Saves the details (pending) and returns where to pay
export async function submitCheckout(p: CheckoutPayload): Promise<{ redirect?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('checkout', { body: p })
  if (error) {
    try { return { error: (await (error as { context: Response }).context.json()).error } } catch { return { error: 'משהו השתבש, נסו שוב' } }
  }
  return data
}
