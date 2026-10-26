import { useState } from 'react'
import { useFallen } from '../../lib/data'
import { useLang } from '../../lib/lang'
import type { Fallen } from '../../lib/types'
import Modal from './Modal'

// "לזכרו" / "לזכרה" — taken from the card title the nonprofit wrote
const forMemory = (f: Fallen) => (f.card_title.includes('לזכרה') ? 'לזכרה' : 'לזכרו')

export default function Homes() {
  const fallen = useFallen()
  const { en, t, db, arrow } = useLang()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const close = () => setOpenSlug(null)

  return (
    <>
      <section id="homes" className="homes">
        <div className="wrap homes-inner">
          <h2>{t('מצדיעים לזכרם — מנציחים ומצילים', 'Saluting their memory — remembering and saving lives')}</h2>
          <div className="homes-grid">
            {fallen.data?.map(f => (
              <article className="home-card reveal" key={f.id}>
                {f.hero_image && <img src={f.hero_image} alt={db(f.card_title, f.card_title_en)} />}
                <div className="home-card-body">
                  <h3>{db(f.card_title, f.card_title_en)}</h3>
                  <p>{db(f.card_text, f.card_text_en)}</p>
                  <div className="home-card-actions">
                    <button onClick={() => setOpenSlug(f.slug)}>{t('לסיפור המלא', 'Read the full story')} {arrow}</button>
                    {f.grow_link && <a className="home-donate" href={f.grow_link} target="_blank" rel="noopener">💙 {en ? 'Donate in their memory' : `תרומה ${forMemory(f)}`}</a>}
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
            <button className="memorial-close" aria-label={t('סגירה', 'Close')} onClick={close}>✕</button>
            {(f.eyebrow || f.eyebrow_en) && <span className="memorial-eyebrow">{db(f.eyebrow, f.eyebrow_en)}</span>}
            <h3>{en ? f.modal_title_en || f.card_title_en || f.modal_title || f.card_title : f.modal_title ?? f.card_title}</h3>
            {/* story_html is our own content (seeded from the static site, edited only by staff via RLS) */}
            <div dangerouslySetInnerHTML={{ __html: db(f.story_html, f.story_html_en) }} />
            <div className="memorial-actions">
              {f.grow_link && <a href={f.grow_link} target="_blank" rel="noopener" className="btn btn-sm btn-gold">{en ? 'Donate in their memory' : `לתרומה ${forMemory(f)}`}</a>}
              <button className="btn btn-sm memorial-back" onClick={close}>{t('← חזרה', '← Back')}</button>
            </div>
          </div>
        </Modal>
      ))}
    </>
  )
}
