import { useLocation } from 'react-router-dom'

// 26.10: the English site is the Hebrew site under /en (same pages, same components). Everything that shows text
// or links inside the site asks useLang(): t(he, en) picks the text, to(path) keeps the visitor in their language.
export const isEnPath = (p: string) => p === '/en' || p.startsWith('/en/')
export const toLang = (en: boolean, path: string) => {
  if (!en || !path.startsWith('/') || isEnPath(path)) return path
  return path === '/' ? '/en' : path.startsWith('/#') || path.startsWith('/?') ? '/en' + path.slice(1) : '/en' + path
}
// the same page in the other language (header switch)
export const otherLang = (pathname: string) => isEnPath(pathname) ? (pathname.slice(3) || '/') : (pathname === '/' ? '/en' : '/en' + pathname)

export function useLang() {
  const { pathname } = useLocation()
  const en = isEnPath(pathname)
  return {
    en,
    t: <T,>(he: T, enText: T): T => (en ? enText : he),
    to: (path: string) => toLang(en, path),
    arrow: en ? '→' : '←',   // "go on" arrow: points to the reading direction's end
    // DB text with an English column (dogs.*_en, team.name_en): English when filled, else the Hebrew
    db: (he?: string | null, enText?: string | null) => (en && enText ? enText : he ?? ''),
  }
}
