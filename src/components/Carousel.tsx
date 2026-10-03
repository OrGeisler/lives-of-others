import { useEffect, useState } from 'react'

// Same look as the static site's carousel: whole photo (contain) over a blurred copy of itself
export default function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0)
  const n = images.length
  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setIdx(i => (i + 1) % n), 3500)
    return () => clearInterval(t)
  }, [n, idx])
  const go = (d: number) => setIdx(i => (i + d + n) % n)
  return (
    <div className="carousel">
      <div className="carousel-track" style={{ transform: `translateX(${-idx * 100}%)` }}>
        {images.map(src => (
          <div className="slide" key={src} style={{ ['--bg' as string]: `url("${src}")` }}>
            <img src={src} alt={alt} loading="lazy" />
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button className="carousel-btn carousel-prev" aria-label="הקודם" onClick={() => go(-1)}>‹</button>
          <button className="carousel-btn carousel-next" aria-label="הבא" onClick={() => go(1)}>›</button>
          <div className="carousel-dots">
            {images.map((_, i) => <button type="button" key={i} className={i === idx ? 'on' : ''} aria-label={`תמונה ${i + 1}`} aria-current={i === idx} onClick={() => setIdx(i)} />)}
          </div>
        </>
      )}
    </div>
  )
}
