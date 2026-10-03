import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { VaAccordions } from '../components/VirtualAdoptionDetails'
import { TIERS } from '../lib/constants'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'
import '../styles/checkout.css'

// Personal virtual-adoption page per dog (24.9 item 8, Freedom-Farm style):
// story + photos, 4 "+" accordions, choose a monthly plan, continue to checkout.
export default function VaDog() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const { data: dog, loading } = useDog(slug)
  const [tier, setTier] = useState(50)
  useTitle(dog ? `לאמץ וירטואלית את ${dog.name} — חיים של אחרים` : 'אימוץ וירטואלי — חיים של אחרים')

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>טוען…</div>
  if (!dog || !dog.available_for_virtual) return <div className="wrap" style={{ padding: '80px 0' }}>הכלב הזה לא זמין כרגע לאימוץ וירטואלי. <Link to="/virtual-adoption#choose">לכל הכלבים ←</Link></div>

  const images = dog.gallery.length ? dog.gallery : dog.main_image ? [dog.main_image] : []
  return (
    <>
      <section className="dog-page">
        <div className="dog-page-gallery"><Carousel images={images} alt={dog.name} /></div>
        <div className="dog-page-body dog-modal-body">
          <Link to="/virtual-adoption#choose" className="dog-page-back">→ לכל הכלבים לאימוץ וירטואלי</Link>
          <span className="vd-eyebrow">😇 להיות המלאך השומר של</span>
          <h1>{dog.name}</h1>
          <p className="dog-modal-meta">{[dog.tagline, dog.age_text].filter(Boolean).join(' · ')}</p>
          {dog.story?.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="vd-plan">
        <div className="vd-plan-inner">
          <VaAccordions whatIs />
          <h2 className="vd-h2">בחרו את מסלול החסות החודשית ל{dog.name}</h2>
          <div className="tier-pick" role="radiogroup" aria-label="מסלול חודשי">
            {TIERS.map(t => (
              <button key={t.amt} type="button" role="radio" aria-checked={tier === t.amt}
                className={`tier-card tier-option${t.featured ? ' featured' : ''}${tier === t.amt ? ' on' : ''}`} onClick={() => setTier(t.amt)}>
                {t.featured && <span className="tc-badge">הכי פופולרי</span>}
                <span className="tc-check" aria-hidden="true">{tier === t.amt ? '✓' : ''}</span>
                <div className="tc-ico">{t.ico}</div>
                <div className="tc-amt">{t.amt} ₪ <small>/ חודש</small></div>
                <p>{t.desc}</p>
              </button>
            ))}
          </div>
          <button className="btn btn-angel vd-go" onClick={() => nav(`/checkout?type=virtual&dog=${dog.slug}&tier=${tier}`)}>
            <span className="angel-l1">להשלמת תהליך האימוץ ←</span>
            <span className="angel-l2">{tier} ₪ בחודש · הוראת קבע</span>
          </button>
        </div>
      </section>
    </>
  )
}
