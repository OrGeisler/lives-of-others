import { About, Story, Unique } from '../../components/home/StaticSections'
import Team from '../../components/home/Team'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import { useLang } from '../../lib/lang'

export default function AboutPage() {
  useTitle('על העמותה והצוות — חיים של אחרים', 'About us and our team — Lives of Others')
  const { t } = useLang()
  return (
    <>
      {/* 22.10: no page title/sub-line here (asked to remove); the h1 stays for screen readers and search */}
      <h1 className="sr-only">{t('על העמותה', 'About us')}</h1>
      {/* 13.10: על העמותה → הצוות → מה מייחד → "בדרך להתחלה חדשה" */}
      <About />
      <Team />
      <Unique />
      <Story />
    </>
  )
}
