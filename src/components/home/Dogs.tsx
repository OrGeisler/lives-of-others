import { focusStyle } from '../../lib/focus'
import { Link } from 'react-router-dom'
import { useDogs } from '../../lib/data'
import { rememberGallery, useRestoreGallery } from '../../lib/galleryScroll'

export default function Dogs() {
  const dogs = useDogs()
  useRestoreGallery(!!dogs.data)
  return (
    <section id="dogs" className="wrap dogs">
      <div className="section-head reveal">
        <h2>בואו להכיר את הכלבים שלנו</h2>
        <p>לחצו על כל כלב כדי להיכנס לעמוד המלא שלו — עם עוד תמונות והסיפור המלא. אפשר לאמץ, ואם אי־אפשר — אפשר לאמץ וירטואלית: חסות חודשית שמכסה אוכל, חיסונים וטיפול.</p>
      </div>
      {dogs.error && <p role="alert">לא הצלחנו לטעון את הכלבים כרגע. נסו לרענן את העמוד.</p>}
      <div className="dogs-grid">
        {dogs.data?.map(d => (
          <Link to={`/dogs/${d.slug}`} className="dog-card reveal" key={d.id} onClick={rememberGallery}>
            {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={d.name} loading="lazy" />}
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">{d.name}</span><span className="dog-meta dog-tag">{d.tagline}</span></div>
              <span className="dog-open-hint">להכיר אותי ←</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
