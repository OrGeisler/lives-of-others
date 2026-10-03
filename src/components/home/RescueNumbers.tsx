import { useEffect, useRef, useState } from 'react'
import { useCounters } from '../../lib/data'
import type { Counter } from '../../lib/types'

// [file slug, display name] — photos in /assets/img/ba-<slug>-before|after.jpg
const BEFORE_AFTER: [string, string][] = [
  ['ruhama', 'רוחמה'], ['ometz', 'אומץ'], ['malka', 'מלכה'], ['junior', "ג'וניור"],
  ['ramon', 'רמון'], ['miki', 'מייקי'], ['laura', 'לורה'], ['john', "ג'ון"],
]

function BeforeAfter({ slug, name }: { slug: string; name: string }) {
  // hover reveals "after" (CSS); tap toggles on touch devices
  const [flip, setFlip] = useState(false)
  return (
    <div className={`ba-item${flip ? ' flip' : ''}`} role="button" tabIndex={0} aria-pressed={flip} aria-label={`${name} לפני ואחרי`} onClick={() => setFlip(f => !f)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(f => !f) } }}>
      <img className="ba-before" src={`/assets/img/ba-${slug}-before.jpg`} alt={`${name} לפני`} />
      <img className="ba-after" src={`/assets/img/ba-${slug}-after.jpg`} alt={`${name} אחרי`} />
      <span className="ba-tag">לפני / אחרי</span>
      <span className="ba-name">{name}</span>
    </div>
  )
}

// Count-up when scrolled into view (same easing/duration as the static site)
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min((now - start) / 1800, 1)
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
        else setDone(true)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])
  return <div className="counter-num" ref={ref}>{shown.toLocaleString('en-US')}{done ? suffix : ''}</div>
}

export default function RescueNumbers() {
  const counters = useCounters()
  const list: Counter[] = counters.data?.value ?? []
  return (
    <section className="rescue-numbers">
      <div className="wrap">
        <div className="counters counters-strip reveal">
          {list.map(c => (
            <div className="counter" key={c.label}>
              <CountUp value={c.value} suffix={c.suffix} />
              <div className="counter-label">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="rn-head reveal">
          <h2>מהרחוב אל הבית — ההבדל שאתם עושים</h2>
          <p>אותו כלב, לפני ואחרי ההצלה. כל אחד מהם קיבל הזדמנות שנייה.</p>
        </div>
        <div className="ba-grid reveal" id="ba-grid">
          {BEFORE_AFTER.map(([slug, name]) => <BeforeAfter key={slug} slug={slug} name={name} />)}
        </div>
        <a href="#donate" className="btn btn-gold reveal">לתרומה להצלת כלב</a>
      </div>
    </section>
  )
}
