import Contact from '../../components/home/Contact'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import { useLang } from '../../lib/lang'

export default function ContactPage() {
  useTitle('צור קשר — חיים של אחרים', 'Contact — Lives of Others')
  const { t } = useLang()
  return (
    <>
      <PageHero title={t('צור קשר', 'Contact')} sub={t('רוצים לאמץ, להתנדב או לעזור? נשמח לשמוע מכם.', "Want to adopt, volunteer or help? We'd love to hear from you.")} />
      <Contact />
    </>
  )
}
