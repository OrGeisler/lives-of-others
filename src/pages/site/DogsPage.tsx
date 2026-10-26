import Dogs from '../../components/home/Dogs'
import PageHero from '../../components/PageHero'
import { useTitle } from '../../lib/pagesData'
import '../../styles/home.css'
import { useLang } from '../../lib/lang'

export default function DogsPage() {
  useTitle('הכלבים שלנו — חיים של אחרים', 'Our dogs — Lives of Others')
  const { t } = useLang()
  return (
    <>
      <PageHero title={t('הכלבים שלנו', 'Our dogs')} sub={t('כל אחד מהם מחכה לבית — ובינתיים, למלאך שומר.', 'Each of them is waiting for a home — and meanwhile, for a guardian angel.')} />
      <Dogs />
    </>
  )
}
