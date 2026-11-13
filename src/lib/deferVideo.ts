import { useEffect, type RefObject } from 'react'

// Muted background videos start only after the page has loaded (13.11, SEO/speed): with autoPlay + preload the
// browser fetched megabytes of video before the text was painted (Lighthouse LCP 17s on phones). The poster shows
// until then. `whenVisible` also waits until the video scrolls into view, so people who never scroll there don't download it.
export function useDeferredPlay(ref: RefObject<HTMLVideoElement | null>, whenVisible = false) {
  useEffect(() => {
    const v = ref.current
    if (!v) return
    let io: IntersectionObserver | undefined
    let timer = 0
    const play = () => { v.muted = true; v.play().catch(() => { /* autoplay blocked: the poster stays */ }) }
    const start = () => {
      timer = window.setTimeout(() => {
        if (!whenVisible || !('IntersectionObserver' in window)) return play()
        io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io?.disconnect() } }, { rootMargin: '200px' })
        io.observe(v)
      }, 1200)
    }
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true })
    return () => { window.removeEventListener('load', start); clearTimeout(timer); io?.disconnect() }
  }, [ref, whenVisible])
}
