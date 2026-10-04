import { focusStyle } from '../../lib/focus'
import { Link } from 'react-router-dom'
import { useDogs } from '../../lib/data'

export default function Dogs() {
  const dogs = useDogs()
  return (
    <section id="dogs" className="wrap dogs">
      <div className="section-head reveal">
        <h2>בואו להכיר את הכלבים שלנו</h2>
        <p>לחצו על כל כלב כדי להיכנס לעמוד המלא שלו — עם עוד תמונות והסיפור המלא. אפשר לאמץ, ואם אי־אפשר — אפשר לאמץ וירטואלית: חסות חודשית שמכסה אוכל, חיסונים וטיפול.</p>
      </div>
      {dogs.error && <p role="alert">לא הצלחנו לטעון את הכלבים כרגע. נסו לרענן את העמוד.</p>}
      <div className="dogs-grid">
        {dogs.data?.map(d => (
          <Link to={`/dogs/${d.slug}`} className="dog-card reveal" key={d.id}>
            {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={d.name} loading="lazy" />}
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">{d.name}</span><span className="dog-meta">{d.age_text}</span></div>
              <span className="dog-open-hint">להכיר אותי ←</span>
            </div>
          </Link>
        ))}
      </div>
      <p className="dogs-note">* חלק מהתמונות עדיין בהשלמה. כל הכלבים לאימוץ עם פרופיל מלא ומעודכן — <a href="https://yad4.co.il/organization/%D7%97%D7%99%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%90%D7%97%D7%A8%D7%99%D7%9D" target="_blank" rel="noopener">בעמוד העמותה ב־Yad4 ←</a></p>
    </section>
  )
}
