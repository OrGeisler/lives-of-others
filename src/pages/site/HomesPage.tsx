import Homes from '../../components/home/Homes'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import { useLang } from '../../lib/lang'

export default function HomesPage() {
  useTitle('הבתים הקסומים — פרויקטי הנצחה — חיים של אחרים', 'The Magical Homes — memorial projects — Lives of Others')
  const { t } = useLang()
  return (
    <>
      <PageHero title={t('הבתים הקסומים', 'The Magical Homes')} sub={t('פרויקטי הנצחה לזכר יקירים שנפלו ונרצחו במלחמת ה־7 באוקטובר — מורשתם ממשיכה לחיות דרך הצלת כלבים.', 'Memorial projects for loved ones who fell and were murdered in the October 7 war — their legacy lives on through saving dogs.')} />
      <Homes />
    </>
  )
}
