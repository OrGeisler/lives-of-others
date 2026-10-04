import { Link, useParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { WA_ADOPT, wa } from '../lib/links'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'


// Full-page dog profile (replaces the modal; 24.9 item 7.1, Freedom-Farm style)
export default function DogPage() {
  const { slug = '' } = useParams()
  const { data: dog, loading, error } = useDog(slug)
  useTitle(dog ? `${dog.name} — חיים של אחרים` : 'חיים של אחרים')

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>טוען…</div>
  if (error || !dog) return <div className="wrap" style={{ padding: '80px 0' }}>לא מצאנו את הכלב הזה. <Link to="/dogs">לכל הכלבים ←</Link></div>

  const images = dog.gallery.length ? dog.gallery : dog.main_image ? [dog.main_image] : []

  return (
    <section className="dog-page">
      <div className="dog-page-gallery"><Carousel images={images} alt={dog.name} /></div>
      <div className="dog-page-body dog-modal-body">
        <Link to="/dogs" className="dog-page-back">→ לכל הכלבים</Link>
        <h1>{dog.name}</h1>
        <p className="dog-modal-meta">{[dog.tagline, dog.age_text].filter(Boolean).join(' · ')}</p>
        {dog.story?.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
        <div className="dog-modal-actions">
          {dog.available_for_adoption && <a className="btn btn-orange" href={wa(WA_ADOPT, `היי! אני רוצה לאמץ את ${dog.name} 🐾`)} target="_blank" rel="noopener">אמצו אותי</a>}
          {dog.available_for_virtual && <Link className="btn btn-gold" to={`/virtual-adoption/${dog.slug}`}>להיות המלאך השומר שלי – אימוץ וירטואלי</Link>}
        </div>
      </div>
    </section>
  )
}
