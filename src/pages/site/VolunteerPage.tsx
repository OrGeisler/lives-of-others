import PageHero from '../../components/PageHero'
import { Volunteer } from '../../components/home/StaticSections'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function VolunteerPage() {
  useTitle('התנדבות — חיים של אחרים')
  return (
    <>
      <PageHero title="התנדבות" sub="בואו להיות חלק מהמשפחה — כל שעה שלכם משנה חיים של כלב." />
      <Volunteer />
    </>
  )
}
