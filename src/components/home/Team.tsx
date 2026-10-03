import { useState } from 'react'
import { useTeam } from '../../lib/data'
import type { TeamMember } from '../../lib/types'
import Modal from './Modal'

export default function Team() {
  const team = useTeam()
  const [zoom, setZoom] = useState<TeamMember | null>(null)
  return (
    <section id="team" className="team-band">
      <div className="wrap team">
        <div className="section-head reveal">
          <h2>הצוות שלנו</h2>
          <p>מאחורי כל הצלה עומדים אנשים שנתנו את הלב — מתנדבים, מטפלים ומייסדות שחיים את השליחות כל יום.</p>
        </div>
        <div className="team-grid reveal">
          {team.data?.map(m => (
            <div className="team-member" key={m.id}>
              {m.photo && <img src={m.photo} alt={m.name} onClick={() => setZoom(m)} />}
              <span className="team-name">{m.name}</span>
            </div>
          ))}
        </div>
        {/* click a team photo → enlarge (24.9 4.3) */}
        <Modal open={!!zoom} onClose={() => setZoom(null)} className="lightbox" label="תמונה מוגדלת">
          <button className="lightbox-close" type="button" aria-label="סגירה" onClick={() => setZoom(null)}>✕</button>
          {zoom?.photo && <img src={zoom.photo} alt={zoom.name} />}
          <p className="lightbox-name">{zoom?.name}</p>
        </Modal>
      </div>
    </section>
  )
}
