export type DogLite = { id: string; slug: string; name: string; main_image: string | null }
export type Donor = { id: string; honor_name: string | null; phone: string | null; email: string | null; source: string | null; consent_marketing: boolean; notes: string | null }
export type Sponsorship = {
  id: string; donor_id: string; dog_id: string | null; tier: number | null
  status: 'pending' | 'active' | 'canceled' | 'failed'
  started_at: string | null; canceled_at: string | null; last_payment_at: string | null; created_at: string
  donors?: Donor | null; dogs?: DogLite | null
}
export type Gift = {
  id: string; buyer_donor_id: string | null; dog_id: string | null
  recipient_name: string | null; recipient_phone: string | null; recipient_email: string | null
  greeting: string | null; send_at: string | null; sent_at: string | null
  status: 'pending' | 'paid' | 'sent' | 'canceled'; created_at: string
  donors?: Donor | null; dogs?: DogLite | null
}
export { SOURCES } from '../lib/constants'
export const STATUS: Record<string, string> = { pending: 'ממתין', active: 'פעיל', canceled: 'בוטל', failed: 'חיוב נכשל' }
