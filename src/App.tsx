import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import A11yMenu from './components/A11yMenu'
import Home from './pages/Home'
import { useTitle } from './lib/pagesData'
import { useLang } from './lib/lang'
import { PageErrorBoundary, lazyPage as lazy } from './lib/staleChunks'

// Everything except the home page is loaded on demand (smaller first load). Admin is never loaded by visitors.
const DogPage = lazy(() => import('./pages/DogPage'))
const DogsPage = lazy(() => import('./pages/site/DogsPage'))
const AboutPage = lazy(() => import('./pages/site/AboutPage'))
const HomesPage = lazy(() => import('./pages/site/HomesPage'))
const VolunteerPage = lazy(() => import('./pages/site/VolunteerPage'))
const DonatePage = lazy(() => import('./pages/site/DonatePage'))
const ContactPage = lazy(() => import('./pages/site/ContactPage'))
const VirtualAdoption = lazy(() => import('./pages/VirtualAdoption'))
const VaDog = lazy(() => import('./pages/VaDog'))
const Checkout = lazy(() => import('./pages/Checkout'))
const GiftAdoption = lazy(() => import('./pages/GiftAdoption'))
const Birthday = lazy(() => import('./pages/Birthday'))
const BirthdayThanks = lazy(() => import('./pages/BirthdayThanks'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Accessibility = lazy(() => import('./pages/Accessibility'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const Certificate = lazy(() => import('./pages/Certificate'))

// Old static-site addresses (shared on WhatsApp/Grow/Facebook) keep working
const LEGACY: Record<string, string> = {
  '/index.html': '/', '/virtual-adoption.html': '/virtual-adoption', '/gift-adoption.html': '/gift-adoption',
  '/birthday.html': '/birthday', '/birthday-thanks.html': '/birthday-thanks', '/privacy.html': '/privacy',
  '/certificate.html': '/virtual-adoption', '/en/': '/en', '/en/index.html': '/en',
}
function NotFound() {
  const { pathname, search, hash } = useLocation()
  const { t, to: lang } = useLang()
  const to = LEGACY[pathname]
  useTitle('העמוד לא נמצא — חיים של אחרים', 'Page not found — Lives of Others')
  if (to) return <Navigate to={to + search + hash} replace />
  return <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}><h1>{t('העמוד לא נמצא 🐾', 'Page not found 🐾')}</h1><a href={lang('/')}>{t('לעמוד הבית ←', 'To the home page →')}</a></div>
}

const page = (el: React.ReactNode) => <PageErrorBoundary><Suspense fallback={<div style={{ minHeight: '60vh' }} />}>{el}</Suspense></PageErrorBoundary>

const siteRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="dogs" element={page(<DogsPage />)} />
    <Route path="dogs/:slug" element={page(<DogPage />)} />
    <Route path="about" element={page(<AboutPage />)} />
    <Route path="homes" element={page(<HomesPage />)} />
    <Route path="volunteer" element={page(<VolunteerPage />)} />
    <Route path="donate" element={page(<DonatePage />)} />
    <Route path="contact" element={page(<ContactPage />)} />
    <Route path="virtual-adoption" element={page(<VirtualAdoption />)} />
    <Route path="virtual-adoption/:slug" element={page(<VaDog />)} />
    <Route path="checkout" element={page(<Checkout />)} />
    <Route path="gift-adoption" element={page(<GiftAdoption />)} />
    <Route path="birthday" element={page(<Birthday />)} />
    <Route path="privacy" element={page(<Privacy />)} />
    <Route path="accessibility" element={page(<Accessibility />)} />
    <Route path="*" element={<NotFound />} />
  </>
)

export default function App() {
  const { pathname } = useLocation()
  const staff = pathname.startsWith('/admin') || pathname.startsWith('/certificate')
  return (
    <>
    <Routes>
      <Route element={<Layout />}>{siteRoutes}</Route>
      {/* 26.10: English = the same pages under /en */}
      <Route path="en" element={<Layout />}>{siteRoutes}</Route>
      <Route path="birthday-thanks" element={page(<BirthdayThanks />)} />
      <Route path="en/birthday-thanks" element={page(<BirthdayThanks />)} />
      <Route path="certificate/:id" element={page(<Certificate />)} />
      <Route path="admin/*" element={page(<AdminApp />)} />
    </Routes>
    {!staff && <A11yMenu />}
    </>
  )
}
