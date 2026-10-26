import { Link, useParams } from 'react-router-dom'
import Carousel from '../components/Carousel'
import { WA_ADOPT, wa } from '../lib/links'
import { useDog } from '../lib/data'
import { useTitle } from '../lib/pagesData'
import { ageLabel, ageLabelEn } from '../lib/dogAge'
import { useLang } from '../lib/lang'


// Full-page dog profile (replaces the modal; 24.9 item 7.1, Freedom-Farm style)
export default function DogPage() {
  const { slug = '' } = useParams()
  const { data: dog, loading, error } = useDog(slug)
  const { en, t, to, db } = useLang()
  useTitle(dog ? `${dog.name} — חיים של אחרים` : 'חיים של אחרים', dog ? `${db(dog.name, dog.name_en)} — Lives of Others` : 'Lives of Others')

  if (loading) return <div className="wrap" style={{ padding: '80px 0' }}>{t('טוען…', 'Loading…')}</div>
  if (error || !dog) return <div className="wrap" style={{ padding: '80px 0' }}>{t('לא מצאנו את הכלב הזה.', "We couldn't find this dog.")} <Link to={to('/dogs')}>{t('לכל הכלבים ←', 'All the dogs →')}</Link></div>
  const name = db(dog.name, dog.name_en)
  const age = en ? ageLabelEn(dog) : ageLabel(dog)

  const images = dog.gallery.length ? dog.gallery : dog.main_image ? [dog.main_image] : []

  return (
    <section className="dog-page">
      <div className="dog-page-gallery"><Carousel images={images} alt={name} /></div>
      <div className="dog-page-body dog-modal-body">
        <Link to={to('/dogs')} state={{ back: true }} className="dog-page-back">{t('→ לכל הכלבים', '← All the dogs')}</Link>
        <h1>{name}</h1>
        {db(dog.tagline, dog.tagline_en) && <p className="dog-modal-meta">{db(dog.tagline, dog.tagline_en)}</p>}
        {db(dog.story, dog.story_en).split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          {age && <p className="dog-age-end">🐾 {name}{en ? ', ' : ' '}{age}</p>}
        <div className="dog-modal-actions">
          {dog.available_for_adoption && <a className="btn btn-orange" href={wa(WA_ADOPT, t(`היי! אני רוצה לאמץ את ${dog.name} 🐾`, `Hi! I'd like to adopt ${name} 🐾`))} target="_blank" rel="noopener">{t('אמצו אותי', 'Adopt me')}</a>}
          {dog.available_for_virtual && <Link className="btn btn-gold" to={to(`/virtual-adoption/${dog.slug}`)}>{t('להיות המלאך השומר שלי – אימוץ וירטואלי', 'Be my guardian angel – virtual adoption')}</Link>}
        </div>
      </div>
    </section>
  )
}
