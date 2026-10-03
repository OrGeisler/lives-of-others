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
    const load = async (s: Session | null) => {
      setSession(s)
      if (!s) { setRole(null); setLoading(false); return }
      // claim_staff turns an invited email into a staff member on first login, and returns the role
      const { data } = await supabase.rpc('claim_staff')
      setRole((data as Role) ?? null)
      setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => load(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { load(s) })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signOut = async () => { await supabase.auth.signOut() }
  return <Ctx.Provider value={{ session, role, loading, signOut }}>{children}</Ctx.Provider>
}
