import { Link } from 'react-router-dom'
import { useBirthdayDog, useCounters, useDogs, useFallen, useTeam } from '../lib/data'

// B0: home page skeleton fed from Supabase. Full 1:1 port of all sections comes in B1.
export default function Home() {
  const dogs = useDogs()
  const fallen = useFallen()
  const team = useTeam()
  const counters = useCounters()
  const bday = useBirthdayDog()
  const bdayDog = bday.data?.dogs

  return (
    <>
      <section id="top" className="wrap hero">
        <div className="hero-copy">
          <h1>חיים של אחרים<span className="hero-title-sub">עמותה להצלה, טיפול ושיקום כלבים נטושים</span></h1>
          <p className="hero-sub">אנחנו מחלצים כלבים מהרחוב, מההסגרים וממצבי הזנחה קשים — נותנים להם אוכל, טיפול רפואי, בית, ומעל הכול: את ההרגשה שהם אהובים.</p>
          <span className="hero-chip">🐾 העמותה היחידה בישראל שבה הכלבים גרים בבתים — לא בכלובים</span>
          <div className="cta-row">
            <a href="#dogs" className="btn btn-orange">אני רוצה לאמץ כלב</a>
            <a href="#donate" className="btn btn-gold">אני רוצה לתרום</a>
            <a href="#volunteer" className="btn btn-green">אני רוצה להתנדב</a>
          </div>
        </div>
        <figure className="tv">
          <div className="tv-antenna" aria-hidden="true" />
          <div className="tv-body">
            <div className="tv-screen">
              <video autoPlay muted loop playsInline preload="auto" poster="/assets/img/channel12-poster.jpg">
                <source src="/assets/video/channel12.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="tv-panel" aria-hidden="true"><span className="tv-knob" /><span className="tv-knob" /><span className="tv-grill" /></div>
          </div>
          <div className="tv-legs" aria-hidden="true"><span /><span /></div>
          <figcaption className="tv-caption">📺 הכתבה ששודרה בערוץ 12</figcaption>
        </figure>
      </section>

      <section className="rescue-numbers">
        <div className="wrap">
          <div className="counters">
            {counters.data?.value.map(c => (
              <div className="counter" key={c.label}>
                <div className="counter-num">{c.value.toLocaleString('he-IL')}{c.suffix}</div>
                <div className="counter-label">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="team-band">
        <div className="wrap team">
          <div className="section-head"><h2>הצוות שלנו</h2></div>
          <div className="team-grid">
            {team.data?.map(m => (
              <div className="team-member" key={m.id}>
                {m.photo && <img src={m.photo} alt={m.name} />}
                <span className="team-name">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="homes" className="homes">
        <div className="wrap homes-inner">
          <h2>מצדיעים לזכרם — מנציחים ומצילים</h2>
          <div className="homes-grid">
            {fallen.data?.map(f => (
              <article className="home-card" key={f.id}>
                {f.hero_image && <img src={f.hero_image} alt={f.card_title} />}
                <div className="home-card-body">
                  <h3>{f.card_title}</h3>
                  <p>{f.card_text}</p>
                  {f.grow_link && <div className="home-card-actions"><a className="home-donate" href={f.grow_link} target="_blank" rel="noopener">💙 לתרומה</a></div>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dogs" className="wrap dogs">
        <div className="section-head"><h2>בואו להכיר את הכלבים שלנו</h2></div>
        {dogs.error && <p>שגיאה בטעינת הכלבים: {dogs.error}</p>}
        <div className="dogs-grid">
          {dogs.data?.map(d => (
            <Link to={`/dogs/${d.slug}`} className="dog-card" key={d.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              {d.main_image && <img src={d.main_image} alt={d.name} loading="lazy" />}
              <div className="dog-card-body">
                <div className="dog-name-row"><span className="dog-name">{d.name}</span><span className="dog-meta">{d.age_text}</span></div>
                <span className="dog-open-hint">להכיר אותי ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {bdayDog && (
        <section className="bday-home">
          <div className="dom-inner">
            {bdayDog.main_image && <img src={bdayDog.main_image} alt={bdayDog.name} />}
            <div className="dom-body">
              <span className="dom-tag">🎂 יום הולדת החודש</span>
              <h2>ל<span>{bdayDog.name}</span> יש יום הולדת! 🎉</h2>
              <p>{bdayDog.tagline}</p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
