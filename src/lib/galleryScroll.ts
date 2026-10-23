import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// 22.10: "back to all dogs" returns to the same place in the gallery, not to its top.
// The gallery remembers the scroll position when a dog is opened; the dog page's back link passes state {back: true}.
const key = (path: string) => `gallery-y:${path}`

export function rememberGallery() {
  try { sessionStorage.setItem(key(window.location.pathname), String(Math.round(window.scrollY))) } catch { /* private mode */ }
}

export function useRestoreGallery(ready: boolean, fallbackId?: string) {
  const { pathname, state } = useLocation()
  const navType = useNavigationType()
  const back = (state as { back?: boolean } | null)?.back || navType === 'POP'
  useEffect(() => {
    if (!ready || !back) return
    let y: string | null = null
    try { y = sessionStorage.getItem(key(pathname)) } catch { /* private mode */ }
    const go = () => {
      if (y) window.scrollTo(0, Number(y))
      else if (fallbackId) document.getElementById(fallbackId)?.scrollIntoView()
    }
    // after the page's own scroll-to-top / hash handling
    const t = setTimeout(go, 60)
    return () => clearTimeout(t)
  }, [ready, back, pathname, fallbackId])
}
