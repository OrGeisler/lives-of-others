import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll-reveal for any `.reveal` element (also ones rendered later, after data loads),
// and scroll to #hash targets once they exist (content is async).
export function usePageEffects() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    const scan = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [pathname])

  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    let tries = 0
    const t = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el || ++tries > 40) { clearInterval(t); el?.scrollIntoView() }
    }, 50)
    return () => clearInterval(t)
  }, [pathname, hash])
}
