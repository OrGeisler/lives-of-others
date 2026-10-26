import PageHero from '../../components/PageHero'
import { Volunteer } from '../../components/home/StaticSections'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import { useLang } from '../../lib/lang'

export default function VolunteerPage() {
  useTitle('התנדבות — חיים של אחרים', 'Volunteer — Lives of Others')
  const { t } = useLang()
  return (
    <>
      <PageHero title={t('התנדבות', 'Volunteer')} sub={t('בואו להיות חלק מהמשפחה — כל שעה שלכם משנה חיים של כלב.', "Come be part of the family — every hour you give changes a dog's life.")} />
      <Volunteer />
    </>
  )
}
