import PageHero from '../../components/PageHero'
import { BeforeAfterSection } from '../../components/home/RescueNumbers'
import { About, Rescues, Story, Unique } from '../../components/home/StaticSections'
import Team from '../../components/home/Team'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function AboutPage() {
  useTitle('על העמותה והצוות — חיים של אחרים')
  return (
    <>
      <PageHero title="על העמותה" sub="מאז 2016 מצילים, מטפלים ומשקמים כלבים — והכלבים גרים בבתים, לא בכלובים." />
      <Story />
      <About />
      <Team />
      <Unique />
      <BeforeAfterSection />
      <Rescues />
    </>
  )
}
