import { focusStyle } from '../../lib/focus'
import { Link } from 'react-router-dom'
import { useDogs } from '../../lib/data'
import { rememberGallery, useRestoreGallery } from '../../lib/galleryScroll'
import { useLang } from '../../lib/lang'

export default function Dogs() {
  const dogs = useDogs()
  const { t, to, db, arrow } = useLang()
  useRestoreGallery(!!dogs.data)
  return (
    <section id="dogs" className="wrap dogs">
      <div className="section-head reveal">
        <h2>{t('בואו להכיר את הכלבים שלנו', 'Meet our dogs')}</h2>
        <p>{t('לחצו על כל כלב כדי להיכנס לעמוד המלא שלו — עם עוד תמונות והסיפור המלא. אפשר לאמץ, ואם אי־אפשר — אפשר לאמץ וירטואלית: חסות חודשית שמכסה אוכל, חיסונים וטיפול.', "Click any dog to open their full page — with more photos and the whole story. You can adopt, and if you can't — you can adopt virtually: a monthly sponsorship that covers food, vaccines and care.")}</p>
      </div>
      {dogs.error && <p role="alert">{t('לא הצלחנו לטעון את הכלבים כרגע. נסו לרענן את העמוד.', "We couldn't load the dogs right now. Please refresh the page.")}</p>}
      <div className="dogs-grid">
        {dogs.data?.map(d => (
          <Link to={to(`/dogs/${d.slug}`)} className="dog-card reveal" key={d.id} onClick={rememberGallery}>
            {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={db(d.name, d.name_en)} loading="lazy" />}
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">{db(d.name, d.name_en)}</span><span className="dog-meta dog-tag">{db(d.tagline, d.tagline_en)}</span></div>
              <span className="dog-open-hint">{t('להכיר אותי', 'Meet me')} {arrow}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
