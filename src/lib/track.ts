// Anonymous visit stats (12.11), shown in admin → סטטיסטיקה. No cookies, no IP, nothing personal:
// a random id per tab session, the page path (no query string), the visit's source, phone/desktop and language.
// Only the live site counts: not admin pages, not previews/localhost, not bots, not a browser with a staff login.
const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
type Kind = 'view' | 'wa' | 'pay'

const get = (k: string) => { try { return sessionStorage.getItem(k) } catch { return null } }
const set = (k: string, v: string) => { try { sessionStorage.setItem(k, v) } catch { /* private mode */ } }

function staffBrowser() {
  try { return Object.keys(localStorage).some(k => k.startsWith('sb-') && k.endsWith('-auth-token')) } catch { return false }
}

function enabled() {
  if (!/(^|\.)lives-of-others\.com$/.test(location.hostname)) return false
  if (navigator.webdriver || /bot|crawl|spider|slurp|preview|headless|lighthouse/i.test(navigator.userAgent)) return false
  return !staffBrowser()
}

const SOURCES: [RegExp, string][] = [
  [/facebook|fb\.|fban|fbav/i, 'facebook'], [/instagram/i, 'instagram'], [/whatsapp|wa\.me/i, 'whatsapp'],
  [/google/i, 'google'], [/bing/i, 'bing'], [/tiktok/i, 'tiktok'], [/youtube|youtu\.be/i, 'youtube'],
  [/t\.co$|twitter|x\.com/i, 'x'], [/linkedin|lnkd/i, 'linkedin'], [/chatgpt|openai|perplexity|claude|gemini|copilot/i, 'ai'],
]

// where this visit came from: ?utm_source=… wins, then the in-app browser, then the referring site
function landingSource() {
  const utm = new URLSearchParams(location.search).get('utm_source')
  if (utm) return utm.toLowerCase().slice(0, 60)
  const ua = navigator.userAgent
  if (/Instagram/.test(ua)) return 'instagram'
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return 'facebook'
  let host = ''
  try { host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : '' } catch { /* bad referrer */ }
  if (!host || host.endsWith('lives-of-others.com')) return 'direct'
  return SOURCES.find(([re]) => re.test(host))?.[1] ?? host.slice(0, 60)
}

function visit() {
  let id = get('lo-visit')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    set('lo-visit', id)
    set('lo-source', landingSource())
  }
  return id
}

const device = () => /iPad|Tablet/i.test(navigator.userAgent) ? 'tablet' : matchMedia('(max-width: 760px)').matches ? 'phone' : 'desktop'

export function track(kind: Kind, path = location.pathname) {
  if (!enabled()) return
  const body = {
    kind, path: path.slice(0, 200), visit: visit(), source: get('lo-source') ?? 'direct',
    device: device(), lang: path === '/en' || path.startsWith('/en/') ? 'en' : 'he',
  }
  // keepalive: a WhatsApp/payment click leaves the page right away; the request must still go out
  fetch(`${url}/rest/v1/site_events`, {
    method: 'POST', keepalive: true, body: JSON.stringify(body),
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  }).catch(() => { /* stats never break the site */ })
}

// one listener for every WhatsApp and payment link on the site
const PAY = /grow\.link|donation\.lives-of-others\.org|meshulam/i
export function trackClicks() {
  document.addEventListener('click', e => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!a) return
    if (/wa\.me|api\.whatsapp\.com/.test(a.href)) track('wa')
    else if (PAY.test(a.href)) track('pay')
  }, { capture: true })
}
