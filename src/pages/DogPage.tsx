import { Link, useParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { useDog } from '../lib/data'

const WA = '972528296622'

// Full-page dog profile (replaces the modal; 24.9 item 7.1, Freedom-Farm style)
export default function DogPage() {
  const { slug = '' } = useParams()
  const { data: dog, loading, error } = useDog(slug)

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>טוען…</div>
  if (error || !dog) return <div className="wrap" style={{ padding: '80px 0' }}>לא מצאנו את הכלב הזה. <Link to="/#dogs">לכל הכלבים ←</Link></div>

  const images = dog.gallery.length ? dog.gallery : dog.main_image ? [dog.main_image] : []
  const waText = encodeURIComponent(`היי! אני רוצה לאמץ את ${dog.name} 🐾`)

  return (
    <section className="dog-page">
      <div className="dog-page-gallery"><Carousel images={images} alt={dog.name} /></div>
      <div className="dog-page-body dog-modal-body">
        <Link to="/#dogs" className="dog-page-back">→ לכל הכלבים</Link>
        <h1>{dog.name}</h1>
        <p className="dog-modal-meta">{[dog.tagline, dog.age_text].filter(Boolean).join(' · ')}</p>
        {dog.story?.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        <div className="dog-modal-actions">
          {dog.available_for_adoption && <a className="btn btn-orange" href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noopener">אמצו אותי</a>}
          {dog.available_for_virtual && <a className="btn btn-gold" href="/virtual-adoption">להיות המלאך השומר שלי – אימוץ וירטואלי</a>}
        </div>
      </div>
    </section>
  )
}
