import { useState } from 'react'
import { useTeam } from '../../lib/data'
import { useLang } from '../../lib/lang'
import type { TeamMember } from '../../lib/types'
import Modal from './Modal'

export default function Team() {
  const team = useTeam()
  const { t, db } = useLang()
  const [zoom, setZoom] = useState<TeamMember | null>(null)
  return (
    <section id="team" className="team-band">
      <div className="wrap team">
        <div className="section-head reveal">
          <h2>{t('הצוות שלנו', 'Our team')}</h2>
          <p>{t('מאחורי כל הצלה עומדים אנשים שנתנו את הלב — מתנדבים, מטפלים ומייסדות שחיים את השליחות כל יום.', 'Behind every rescue are people who gave their hearts — volunteers, caregivers and founders who live the mission every day.')}</p>
        </div>
        <div className="team-grid reveal">
          {team.data?.map(m => (
            <div className="team-member" key={m.id}>
              {m.photo && <button type="button" className="team-zoom" aria-label={t(`הגדלת התמונה של ${m.name}`, `Enlarge ${db(m.name, m.name_en)}'s photo`)} onClick={() => setZoom(m)}><img src={m.photo} alt={db(m.name, m.name_en)} /></button>}
              <span className="team-name">{db(m.name, m.name_en)}</span>
            </div>
          ))}
        </div>
        {/* click a team photo → enlarge (24.9 4.3) */}
        <Modal open={!!zoom} onClose={() => setZoom(null)} className="lightbox" label={t('תמונה מוגדלת', 'Enlarged photo')}>
          <button className="lightbox-close" type="button" aria-label={t('סגירה', 'Close')} onClick={() => setZoom(null)}>✕</button>
          {zoom?.photo && <img src={zoom.photo} alt={db(zoom.name, zoom.name_en)} />}
          <p className="lightbox-name">{zoom && db(zoom.name, zoom.name_en)}</p>
        </Modal>
      </div>
    </section>
  )
}
