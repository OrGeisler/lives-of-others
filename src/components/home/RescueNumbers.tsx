import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCounters } from '../../lib/data'
import type { Counter } from '../../lib/types'
import { useLang } from '../../lib/lang'

// [file slug, display name] — photos in /assets/img/ba-<slug>-before|after.jpg
const BEFORE_AFTER: [string, string, string][] = [
  ['ruhama', 'רוחמה', 'Ruhama'], ['ometz', 'אומץ', 'Ometz'], ['malka', 'מלכה', 'Malka'], ['junior', "ג'וניור", 'Junior'],
  ['ramon', 'רמון', 'Ramon'], ['miki', 'מייקי', 'Miki'], ['laura', 'לורה', 'Laura'], ['john', "ג'ון", 'John'],
]
// counter labels live in the DB in Hebrew (site_settings.counters)
const COUNTER_EN: Record<string, string> = {
  'כלבים שהצלנו': 'Dogs we have rescued',
  'כלבים בחסותנו': 'Dogs in our care today',
  'עלויות שוטפות חודשיות של בתי המחסה': 'Monthly running costs of the shelters',
}

function BeforeAfter({ slug, name }: { slug: string; name: string }) {
  // hover reveals "after" (CSS); tap toggles on touch devices
  const [flip, setFlip] = useState(false)
  const { t } = useLang()
  return (
    <div className={`ba-item${flip ? ' flip' : ''}`} role="button" tabIndex={0} aria-pressed={flip} aria-label={t(`${name} לפני ואחרי`, `${name} before and after`)} onClick={() => setFlip(f => !f)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(f => !f) } }}>
      <img className="ba-before" src={`/assets/img/ba-${slug}-before.jpg`} alt={t(`${name} לפני`, `${name} before`)} />
      <img className="ba-after" src={`/assets/img/ba-${slug}-after.jpg`} alt={t(`${name} אחרי`, `${name} after`)} />
      <span className="ba-tag">{t('לפני / אחרי', 'Before / after')}</span>
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

// Home: the counters strip on the navy band (24.9 item 2)
export function CountersBand() {
  const counters = useCounters()
  const { en } = useLang()
  const list: Counter[] = counters.data?.value ?? []
  return (
    <section className="rescue-numbers counters-band">
      <div className="wrap">
        <div className="counters counters-strip reveal">
          {list.map(c => (
            <div className="counter" key={c.label}>
              <CountUp value={c.value} suffix={c.suffix} />
              <div className="counter-label">{en ? COUNTER_EN[c.label] ?? c.label : c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About page: "from the street to a home" before/after grid
export function BeforeAfterSection() {
  const { en, t, to } = useLang()
  return (
    <section className="rescue-numbers">
      <div className="wrap">
        <div className="rn-head reveal">
          <h2>{t('מהרחוב אל הבית — ההבדל שאתם עושים', 'From the street to a home — the difference you make')}</h2>
          <p>{t('אותו כלב, לפני ואחרי ההצלה. כל אחד מהם קיבל הזדמנות שנייה.', 'The same dog, before and after the rescue. Each of them got a second chance.')}</p>
        </div>
        <div className="ba-grid reveal" id="ba-grid">
          {BEFORE_AFTER.map(([slug, he, enName]) => <BeforeAfter key={slug} slug={slug} name={en ? enName : he} />)}
        </div>
        <Link to={to('/donate')} className="btn btn-gold reveal">{t('לתרומה להצלת כלב', 'Donate to save a dog')}</Link>
      </div>
    </section>
  )
}
