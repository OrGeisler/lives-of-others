import Homes from '../../components/home/Homes'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function HomesPage() {
  useTitle('הבתים הקסומים — פרויקטי הנצחה — חיים של אחרים')
  return (
    <>
      <PageHero title="הבתים הקסומים" sub="פרויקטי הנצחה לזכר יקירים שנפלו ונרצחו במלחמת ה־7 באוקטובר — מורשתם ממשיכה לחיות דרך הצלת כלבים." />
      <Homes />
    </>
  )
}
