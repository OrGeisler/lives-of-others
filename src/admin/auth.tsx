import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Role = 'admin' | 'editor' | null
type Auth = { session: Session | null; role: Role; loading: boolean; signOut: () => Promise<void> }

const Ctx = createContext<Auth>({ session: null, role: null, loading: true, signOut: async () => {} })
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange also emits INITIAL_SESSION, so it is the single source (no parallel getSession call).
    // Each change gets a sequence number so a slower, older check can never overwrite a newer one, and the
    // RPC runs outside the auth callback (supabase-js can deadlock when awaiting inside it).
    let seq = 0
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const my = ++seq
      setSession(s)
      if (!s) { setRole(null); setLoading(false); return }
      setTimeout(async () => {
        // claim_staff turns an invited email into a staff member on first login, and returns the role
        const { data } = await supabase.rpc('claim_staff')
        if (my !== seq) return
        setRole((data as Role) ?? null)
        setLoading(false)
      }, 0)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signOut = async () => { await supabase.auth.signOut() }
  return <Ctx.Provider value={{ session, role, loading, signOut }}>{children}</Ctx.Provider>
}
