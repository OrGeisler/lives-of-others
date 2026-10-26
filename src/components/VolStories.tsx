import { useState } from 'react'

type Story = { name: string; photo?: string; focus?: string; text: string }
const L = {
  he: { title: 'מה המתנדבים שלנו מספרים 💬', more: 'לסיפור המלא ↓', less: 'לצמצם ↑', all: (n: number) => `לסיפורים נוספים (${n}) ↓` },
  en: { title: 'What our volunteers say 💬', more: 'Read the full story ↓', less: 'Show less ↑', all: (n: number) => `More stories (${n}) ↓` },
}

// Opening of a story: whole sentences up to ~140 characters (the stories are one paragraph each)
function opening(text: string) {
  const parts = text.match(/[^.!?…]+[.!?…]+["'”)]*\s*|.+$/g) ?? [text]
  let out = ''
  for (const p of parts) { out += p; if (out.length >= 140) break }
  return out.trim()
}

// 22.10: photo + name first, then the opening of the story with "full story" / "show less" (Hebrew + English)
export default function VolStories({ stories, lang = 'he' }: { stories: Story[]; lang?: 'he' | 'en' }) {
  const t = L[lang]
  const [all, setAll] = useState(false)
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setOpen(s => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n })
  const shown = all ? stories : stories.slice(0, 3)
  return (
    <div className="vol-stories reveal">
      <h3>{t.title}</h3>
      <div className="vol-stories-grid">
        {shown.map((s, i) => {
          const head = opening(s.text)
          const long = head.length < s.text.trim().length
          return (
            <figure key={i} className="vol-story">
              {s.photo && <img className="vol-story-photo" src={s.photo} alt={s.name} loading="lazy" style={s.focus ? { objectPosition: s.focus } : undefined} />}
              <figcaption>{s.name}</figcaption>
              <blockquote>{open.has(i) || !long ? s.text : head}</blockquote>
              {long && <button type="button" className="vol-story-toggle" aria-expanded={open.has(i)} onClick={() => toggle(i)}>{open.has(i) ? t.less : t.more}</button>}
            </figure>
          )
        })}
      </div>
      {!all && stories.length > 3 && <button type="button" className="btn btn-outline-green" onClick={() => setAll(true)}>{t.all(stories.length - 3)}</button>}
    </div>
  )
}
