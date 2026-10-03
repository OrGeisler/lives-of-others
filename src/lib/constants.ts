// Single source of truth for amounts and lists used by the site, the checkout and the admin.
// (The checkout edge function and the DB check constraint mirror these: 25/50/100, 180, SOURCES keys.)
export type Tier = { amt: number; ico: string; desc: string; featured?: boolean }
export const TIERS: Tier[] = [
  { amt: 25, ico: '🦴', desc: 'תמיכה באוכל איכותי וחטיפים שהכלבים הכי אוהבים' },
  { amt: 50, ico: '💉', desc: 'תמיכה באוכל איכותי, חיסונים בשגרה וטיפולים רפואיים', featured: true },
  { amt: 100, ico: '🏡', desc: 'תמיכה באוכל איכותי, טיפולים רפואיים מצילי חיים ותחזוקת מתחם בית המחסה' },
]
export const TIER_AMOUNTS = TIERS.map(t => t.amt)
export const GIFT_SUM = 180

export const SOURCES: Record<string, string> = {
  friends: 'חברים', facebook: 'פייסבוק', instagram: 'אינסטגרם', volunteering: 'הגעתי להתנדבות', news: 'חדשות', other: 'אחר',
}

// Israel-local calendar date (YYYY-MM-DD). toISOString() is UTC and gives "yesterday" between 00:00–03:00.
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const WAZE_SHELTER = 'https://waze.com/ul?q=%D7%94%D7%91%D7%99%D7%AA%20%D7%94%D7%A7%D7%A1%D7%95%D7%9D%20%D7%A2%22%D7%A9%20%D7%A2%D7%93%D7%99%20%D7%A6%D7%95%D7%A8&navigate=yes'
