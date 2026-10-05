import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTitle } from '../lib/pagesData'
import BirthdayHome from '../components/home/BirthdayHome'
import Doors, { CtaBand } from '../components/home/Doors'
import Hero from '../components/home/Hero'
import { BeforeAfterSection, CountersBand } from '../components/home/RescueNumbers'
import { Press, Rescues } from '../components/home/StaticSections'
import '../styles/home.css'

// Old one-page anchors (shared links like lives-of-others.com/#dogs) → the new pages
const MOVED: Record<string, string> = {
  '#dogs': '/dogs', '#about': '/about', '#team': '/about', '#homes': '/homes',
  '#volunteer': '/volunteer', '#donate': '/donate', '#contact': '/contact', '#sponsor': '/virtual-adoption',
}

// Home: hero, numbers, before/after, doors to every area, birthday, press, rescue stories, closing CTA
export default function Home() {
  useTitle('חיים של אחרים — הצלת כלבים נטושים, טיפול ושיקום')
  const { hash } = useLocation()
  const nav = useNavigate()
  useEffect(() => { if (MOVED[hash]) nav(MOVED[hash], { replace: true }) }, [hash, nav])
  return (
    <>
      <Hero />
      <CountersBand />
      <BeforeAfterSection />
      <Doors />
      <BirthdayHome />
      <Press />
      <Rescues />
      <CtaBand />
    </>
  )
}
