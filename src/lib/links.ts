// Fixed external links (same values as the static site). Editable copies live in site_settings.links.
export const DONATE_URL = 'http://donation.lives-of-others.org/truma'
export const GROW_VIRTUAL = 'https://pay.grow.link/NzMwNzY~417a0ec0d5f219cf2a3f89acc96cb22a-Mzg0MjMyNw'
export const GROW_ITEMS = 'https://pay.grow.link/d11531631a4771ca56c52465ec53819b-MzE0NDM5Nw'
export const WA_ADOPT = '972528296622' // ברי
export const WA_TALI = '972546881116'  // טלי
export const wa = (num: string, text: string) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`
