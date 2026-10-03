import { useState } from 'react'
import { useFallen } from '../../lib/data'
import type { Fallen } from '../../lib/types'
import Modal from './Modal'

// "לזכרו" / "לזכרה" — taken from the card title the nonprofit wrote
const forMemory = (f: Fallen) => (f.card_title.includes('לזכרה') ? 'לזכרה' : 'לזכרו')

export default function Homes() {
  const fallen = useFallen()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const close = () => setOpenSlug(null)

  return (
    <>
      <section id="homes" className="homes">
        <div className="wrap homes-inner">
          <h2>מצדיעים לזכרם — מנציחים ומצילים</h2>
          <div className="homes-grid">
            {fallen.data?.map(f => (
              <article className="home-card reveal" key={f.id}>
                {f.hero_image && <img src={f.hero_image} alt={f.card_title} />}
                <div className="home-card-body">
                  <h3>{f.card_title}</h3>
                  <p>{f.card_text}</p>
                  <div className="home-card-actions">
                    <button onClick={() => setOpenSlug(f.slug)}>לסיפור המלא ←</button>
                    {f.grow_link && <a className="home-donate" href={f.grow_link} target="_blank" rel="noopener">💙 תרומה {forMemory(f)}</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {fallen.data?.map(f => (
        <Modal key={f.id} open={openSlug === f.slug} onClose={close} className="memorial-modal">
          <div className="memorial-modal-inner">
            <button className="memorial-close" aria-label="סגירה" onClick={close}>✕</button>
            {f.eyebrow && <span className="memorial-eyebrow">{f.eyebrow}</span>}
            <h3>{f.modal_title ?? f.card_title}</h3>
            {/* story_html is our own content (seeded from the static site, edited only by staff via RLS) */}
            <div dangerouslySetInnerHTML={{ __html: f.story_html ?? '' }} />
            <div className="memorial-actions">
              {f.grow_link && <a href={f.grow_link} target="_blank" rel="noopener" className="btn btn-sm btn-gold">לתרומה {forMemory(f)}</a>}
              <button className="btn btn-sm memorial-back" onClick={close}>← חזרה</button>
            </div>
          </div>
        </Modal>
      ))}
    </>
  )
}
