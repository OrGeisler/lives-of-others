import PageHero from '../../components/PageHero'
import { Donate, Updates } from '../../components/home/StaticSections'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function DonatePage() {
  useTitle('תרומה — חיים של אחרים')
  return (
    <>
      <PageHero title="תרומה" sub="כל תרומה מצילה חיים — אוכל, טיפול רפואי ובית חם לכלבים שאין להם אף אחד אחר." />
      <Donate />
      <Updates />
    </>
  )
}
