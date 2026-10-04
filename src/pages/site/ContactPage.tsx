import Contact from '../../components/home/Contact'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function ContactPage() {
  useTitle('צור קשר — חיים של אחרים')
  return (
    <>
      <PageHero title="צור קשר" sub="רוצים לאמץ, להתנדב או לעזור? נשמח לשמוע מכם." />
      <Contact />
    </>
  )
}
