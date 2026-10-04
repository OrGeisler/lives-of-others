import Dogs from '../../components/home/Dogs'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'

export default function DogsPage() {
  useTitle('הכלבים שלנו — חיים של אחרים')
  return (
    <>
      <PageHero title="הכלבים שלנו" sub="כל אחד מהם מחכה לבית — ובינתיים, למלאך שומר." />
      <Dogs />
    </>
  )
}
