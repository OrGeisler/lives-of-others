// Fixed external links (same values as the static site). site_settings.links holds the Grow link the checkout
// edge function redirects to — keep the two in sync if a link changes.
export const DONATE_URL = 'http://donation.lives-of-others.org/truma'
export const GROW_VIRTUAL = 'https://pay.grow.link/NzMwNzY~417a0ec0d5f219cf2a3f89acc96cb22a-Mzg0MjMyNw'
export const GROW_GIFT = 'https://pay.grow.link/NzMwNzY~58bde7f77ad9f32d0c8fe83f02b2491f-NDA4MTEwNw'
export const GROW_BIRTHDAY = 'https://pay.grow.link/NzMwNzY~f60f9b4d0f879c81b2de67a4c05a0723-NDA4MTEyNQ'
export const GROW_TEST = 'https://pay.grow.link/NzMwNzY~d83698f06c60294b57e161cb088dff9a-NDA4MTIzMg' // 1/2/3 ₪ test page
export const isTestMode = () => {
  try {
    const q = new URLSearchParams(location.search).get('test')
    if (q === '1') sessionStorage.setItem('loo-test', '1')
    if (q === '0') sessionStorage.removeItem('loo-test')
    return sessionStorage.getItem('loo-test') === '1'
  } catch { return false }
}
export const GROW_ITEMS = 'https://pay.grow.link/d11531631a4771ca56c52465ec53819b-MzE0NDM5Nw'
export const WA_ADOPT = '972528296622' // ברי
export const WA_TALI = '972546881116'  // טלי
export const wa = (num: string, text: string) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`
