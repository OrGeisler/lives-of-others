import { useTitle } from '../lib/pagesData'
import BirthdayHome from '../components/home/BirthdayHome'
import Contact from '../components/home/Contact'
import Dogs from '../components/home/Dogs'
import Hero from '../components/home/Hero'
import Homes from '../components/home/Homes'
import RescueNumbers from '../components/home/RescueNumbers'
import { About, Donate, GiftBanner, Press, Rescues, Story, Unique, Updates, Volunteer } from '../components/home/StaticSections'
import Team from '../components/home/Team'
import VirtualAdoptionHome from '../components/home/VirtualAdoptionHome'
import '../styles/home.css'

// Home page — same sections and order as the static site (index.html on main, after the 24.9 round)
export default function Home() {
  useTitle('חיים של אחרים — הצלת כלבים נטושים, טיפול ושיקום')
  return (
    <>
      <Hero />
      <RescueNumbers />
      <Story />
      <About />
      <Team />
      <Unique />
      <Homes />
      <Dogs />
      <VirtualAdoptionHome />
      <GiftBanner />
      <BirthdayHome />
      <Press />
      <Rescues />
      <Volunteer />
      <Donate />
      <Updates />
      <Contact />
    </>
  )
}
