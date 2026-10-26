import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { VaAccordions } from '../components/VirtualAdoptionDetails'
import { TIERS } from '../lib/constants'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'
import '../styles/checkout.css'
import { ageLabel, ageLabelEn } from '../lib/dogAge'
import { useLang } from '../lib/lang'

// Personal virtual-adoption page per dog (24.9 item 8, Freedom-Farm style):
// story + photos, 4 "+" accordions, choose a monthly plan, continue to checkout.
export default function VaDog() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const { data: dog, loading } = useDog(slug)
  const [tier, setTier] = useState(50)
  const { en, t, to, db, arrow } = useLang()
  useTitle(dog ? `לאמץ וירטואלית את ${dog.name} — חיים של אחרים` : 'אימוץ וירטואלי — חיים של אחרים',
    dog ? `Virtually adopt ${db(dog.name, dog.name_en)} — Lives of Others` : 'Virtual adoption — Lives of Others')

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>{t('טוען…', 'Loading…')}</div>
  if (!dog || !dog.available_for_virtual) return <div className="wrap" style={{ padding: '80px 0' }}>{t('הכלב הזה לא זמין כרגע לאימוץ וירטואלי.', "This dog isn't available for virtual adoption right now.")} <Link to={to('/virtual-adoption#choose')}>{t('לכל הכלבים ←', 'All the dogs →')}</Link></div>
  const name = db(dog.name, dog.name_en)
  const age = en ? ageLabelEn(dog) : ageLabel(dog)

  const images = dog.gallery.length ? dog.gallery : dog.main_image ? [dog.main_image] : []
  return (
    <>
      <section className="dog-page">
        <div className="dog-page-gallery"><Carousel images={images} alt={name} /></div>
        <div className="dog-page-body dog-modal-body">
          <Link to={to('/virtual-adoption')} state={{ back: true }} className="dog-page-back">{t('→ לכל הכלבים לאימוץ וירטואלי', '← All the dogs for virtual adoption')}</Link>
          <span className="vd-eyebrow">{t('😇 להיות המלאך השומר של', '😇 Be the guardian angel of')}</span>
          <h1>{name}</h1>
          {db(dog.tagline, dog.tagline_en) && <p className="dog-modal-meta">{db(dog.tagline, dog.tagline_en)}</p>}
          {db(dog.story, dog.story_en).split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          {age && <p className="dog-age-end">🐾 {name}{en ? ', ' : ' '}{age}</p>}
        </div>
      </section>

      <section className="vd-plan">
        <div className="vd-plan-inner">
          <VaAccordions whatIs />
          <h2 className="vd-h2">{t(`בחרו את מסלול החסות החודשית ל${dog.name}`, `Choose ${name}'s monthly sponsorship plan`)}</h2>
          <div className="tier-pick" role="radiogroup" aria-label={t('מסלול חודשי', 'Monthly plan')}>
            {TIERS.map(x => (
              <button key={x.amt} type="button" role="radio" aria-checked={tier === x.amt}
                className={`tier-card tier-option${x.featured ? ' featured' : ''}${tier === x.amt ? ' on' : ''}`} onClick={() => setTier(x.amt)}>
                {x.featured && <span className="tc-badge">{t('הכי פופולרי', 'Most popular')}</span>}
                <span className="tc-check" aria-hidden="true">{tier === x.amt ? '✓' : ''}</span>
                <div className="tc-ico">{x.ico}</div>
                <div className="tc-amt">{t(`${x.amt} ₪`, `₪${x.amt}`)} <small>{t('/ חודש', '/ month')}</small></div>
                <p>{en ? x.descEn : x.desc}</p>
              </button>
            ))}
          </div>
          <button className="btn btn-angel vd-go" onClick={() => nav(to(`/checkout?type=virtual&dog=${dog.slug}&tier=${tier}`))}>
            <span className="angel-l1">{t('להשלמת תהליך האימוץ', 'Complete the adoption')} {arrow}</span>
            <span className="angel-l2">{t(`${tier} ₪ בחודש · הוראת קבע`, `₪${tier} a month · standing order`)}</span>
          </button>
        </div>
      </section>
    </>
  )
}
