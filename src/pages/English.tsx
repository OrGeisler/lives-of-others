import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePageEffects } from '../lib/usePageEffects'
import { WA_ADOPT, WA_TALI, wa } from '../lib/links'
import { MAPS_SHELTER, WAZE_SHELTER, GIFT_SUM } from '../lib/constants'
import { useBirthdayDog, useCounters, useDogs, useTeam } from '../lib/data'
import { usePayLinks } from '../lib/useLinks'
import { isTestMode } from '../lib/links'
import { focusStyle } from '../lib/focus'
import { supabase } from '../lib/supabase'
import { VOLUNTEER_STORIES_EN } from '../lib/volunteerStoriesEn'
import type { Dog } from '../lib/types'
import '../styles/home.css'
import '../styles/pages.css'
import '../styles/checkout.css'

// English version of the site (17.10: "everything also in English"). One page, LTR, outside the Hebrew Layout.
// Same structure and content as the Hebrew site; dogs and team come from the DB (*_en fields).
// Payments go to the same Grow pages, through the same checkout form at /en/checkout (English, no Hebrew layout).

function openModal(id: string) {
  (document.getElementById(id) as HTMLDialogElement | null)?.showModal()
}
function closeModal(e: MouseEvent<HTMLElement>) {
  e.currentTarget.closest('dialog')?.close()
}
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) e.currentTarget.close()
}

const COUNTER_EN: Record<string, string> = {
  'כלבים שהצלנו': 'Dogs we have rescued',
  'כלבים בחסותנו': 'Dogs in our care today',
  'עלויות שוטפות חודשיות של בתי המחסה': 'Monthly running costs of the shelters',
}
const TIERS_EN = [
  { amt: 25, ico: '🦴', desc: 'Supports quality food and the treats the dogs love most' },
  { amt: 50, ico: '💉', desc: 'Supports quality food, routine vaccines and medical care', featured: true },
  { amt: 100, ico: '🏡', desc: 'Supports quality food, life-saving medical care and upkeep of the shelter' },
]
const dogName = (d: Dog) => d.name_en || d.name
const paras = (s?: string | null) => (s ?? '').split(/\n\s*\n/).filter(Boolean)

function Tv() {
  const video = useRef<HTMLVideoElement>(null)
  const [sound, setSound] = useState(false)
  const [playing, setPlaying] = useState(false)
  const v = () => video.current
  return (
    <figure className="tv">
      <div className="tv-antenna" aria-hidden="true"></div>
      <div className="tv-body">
        <div className="tv-screen">
          <video ref={video} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} autoPlay muted loop playsInline preload="auto" poster="/assets/img/channel12-poster.jpg" aria-label="Our story on Israel's Channel 12">
            <source src="/assets/video/channel12.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="tv-panel">
          <button className="tv-knob tv-btn" type="button" onClick={() => { const x = v(); if (x) { if (x.paused) x.play().catch(() => {}); else x.pause() } }} aria-label={playing ? 'Pause' : 'Play'} title={playing ? 'Pause' : 'Play'}>{playing ? '⏸' : '▶'}</button>
          <button className="tv-knob tv-btn" type="button" onClick={() => { const x = v(); if (x) { x.muted = !x.muted; if (!x.muted) x.play().catch(() => {}); setSound(!x.muted) } }} aria-pressed={sound} aria-label={sound ? 'Mute' : 'Sound on'} title={sound ? 'Mute' : 'Sound on'}>{sound ? '🔊' : '🔇'}</button>
          <button className="tv-knob tv-btn" type="button" onClick={() => { const x = v(); if (x) { x.currentTime = 0; x.play().catch(() => {}) } }} aria-label="From the start" title="From the start">⏮</button>
          <span className="tv-grill" aria-hidden="true"></span>
        </div>
      </div>
      <div className="tv-legs" aria-hidden="true"><span></span><span></span></div>
      <figcaption className="tv-caption">📺 Our story on Israel's Channel 12 (Hebrew) · controls on the side of the TV</figcaption>
    </figure>
  )
}

function DogCard({ d }: { d: Dog }) {
  const [more, setMore] = useState(false)
  const p = paras(d.story_en)
  return (
    <article className="gdog en-dog reveal">
      {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={dogName(d)} loading="lazy" />}
      <div className="gdog-body">
        <h3>{dogName(d)}</h3>
        {d.tagline_en && <span className="gdog-tag">{d.tagline_en}</span>}
        {p[0] && <p>{p[0]}</p>}
        {more
          ? <>{p.slice(1).map((x, i) => <p key={i}>{x}</p>)}{d.age_en && <p className="dog-age-end">🐾 {dogName(d)} · {d.age_en}</p>}</>
          : p.length > 1 && <button className="gdog-more" type="button" onClick={() => setMore(true)}>Want to know me better? ↓</button>}
        <div className="en-dog-actions">
          {d.available_for_adoption && <a className="btn btn-sm btn-orange" href={wa(WA_ADOPT, `Hi! I'd like to adopt ${dogName(d)} 🐾`)} target="_blank" rel="noopener">Adopt me</a>}
          {d.available_for_virtual && <a className="btn btn-sm btn-gold" href={`#virtual`} onClick={() => sessionStorage.setItem('en-va-dog', d.slug)}>Be my guardian angel</a>}
        </div>
      </div>
    </article>
  )
}

function Virtual({ dogs }: { dogs: Dog[] }) {
  const [tier, setTier] = useState(50)
  const [dog, setDog] = useState<string>('')
  useEffect(() => {
    const pick = () => { try { const s = sessionStorage.getItem('en-va-dog'); if (s) setDog(s) } catch { /* storage blocked */ } }
    pick(); window.addEventListener('hashchange', pick)
    return () => window.removeEventListener('hashchange', pick)
  }, [])
  const vdogs = dogs.filter(d => d.available_for_virtual)
  const chosen = vdogs.find(d => d.slug === dog)
  return (
    <section id="virtual">
      <div className="va-hero">
        <div className="wrap">
          <h2 className="va-h1">Be my guardian angel <span className="va-h1-sub">Virtual adoption</span></h2>
          <div className="va-hero-body">
            <img className="va-hug" src="/assets/img/va-hug.jpg" alt="A hug with dogs at the shelter" loading="lazy" />
            <div className="va-hero-text">
              <p className="va-lead">Not everyone can open their home — but everyone can open their heart.</p>
              <p>Some dogs have a longer road to a permanent home. Some stay with us for months, some for years. For them we created the "My Guardian Angel" program.</p>
              <p>It's your way to become the guardian angel of a dog who needs you — knowing there's a four-legged friend waiting for you, living a good life thanks to you.</p>
              <p>In a virtual adoption you choose a specific dog and accompany them closely with a fixed monthly sponsorship, until they find a real home.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="va-section">
        <div className="en-acc">
          <details className="reveal"><summary>Who is it for?</summary><ul>
            <li>🏠 Your home is already full — you have a dog (or three…) and want to save another soul, but there's no more room on the couch.</li>
            <li>💚 You simply want to do a good deed, and know that thanks to you one dog sleeps tonight full, calm and cared for.</li>
            <li>🐱 You have a cat who rules the house and won't hear of a barking roommate.</li>
            <li>✈️ You travel a lot, work long hours, or are in a period when raising a dog at home is too big a responsibility.</li>
            <li>🧑‍🎓 You're teenagers dreaming of a dog of your own — but your parents aren't convinced yet.</li>
            <li>🎁 You're looking for a meaningful gift to surprise someone you love.</li>
          </ul></details>
          <details className="reveal"><summary>How does it work?</summary><ol>
            <li><b>Choose a dog</b> — browse the dogs, fall in love, and pick the one you want to accompany.</li>
            <li><b>Set a monthly sponsorship</b> — a fixed amount of your choice (standing order) that covers food, vaccines and care.</li>
            <li><b>Stay close</b> — get updates, photos and videos, and watch your dog thrive.</li>
          </ol></details>
          <details className="reveal"><summary>What's included?</summary><ul>
            <li>📜 A personal "My Guardian Angel" adoption certificate with your name — sent to your phone on WhatsApp, with a photo of the dog you adopted.</li>
            <li>📸 Once a month, a personal update from your dog, with photos and videos that will melt your heart.</li>
            <li>🐾 They're already wagging their tail 😊 — you're welcome to visit and go for a walk together (please coordinate with us in advance).</li>
          </ul></details>
        </div>

        <div className="section-head reveal" style={{ margin: '40px 0 22px' }}>
          <h2>Monthly sponsorship options</h2>
          <p>A fixed monthly sponsorship (standing order, in Israeli shekels). The dog stays with us at the shelter and gets food, vaccines and care.</p>
        </div>
        <div className="tier-pick" role="radiogroup" aria-label="Monthly amount">
          {TIERS_EN.map(t => (
            <button key={t.amt} type="button" role="radio" aria-checked={tier === t.amt} className={`tier-card tier-option${t.featured ? ' featured' : ''}${tier === t.amt ? ' on' : ''}`} onClick={() => setTier(t.amt)}>
              {t.featured && <span className="tc-badge">Most popular</span>}
              <span className="tc-check" aria-hidden="true">{tier === t.amt ? '✓' : ''}</span>
              <div className="tc-ico">{t.ico}</div>
              <div className="tc-amt">₪{t.amt} <small>/ month</small></div>
              <p>{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="section-head reveal" style={{ margin: '40px 0 18px' }}>
          <h2>Choose the dog you'd like to accompany 🐾</h2>
        </div>
        <div className="va-gallery">
          {vdogs.map(d => (
            <button key={d.id} type="button" className={`va-gdog reveal${dog === d.slug ? ' on' : ''}`} onClick={() => setDog(d.slug)}>
              {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={dogName(d)} loading="lazy" />}
              <span className="va-gdog-body"><b>{dogName(d)}</b><span>{d.tagline_en}</span><em>{dog === d.slug ? '✓ Chosen' : 'Choose me'}</em></span>
            </button>
          ))}
        </div>
        <div className="en-go">
          {chosen
            ? <Link className="btn btn-angel" to={`/en/checkout?type=virtual&dog=${chosen.slug}&tier=${tier}`}>Continue: {dogName(chosen)} · ₪{tier} / month →</Link>
            : <p className="en-hint">☝️ Choose a dog above to continue</p>}
          <p className="en-hint">Payment is made on Grow's secure Israeli payment page (in Hebrew): credit card, Bit or Google Pay. From abroad, you can also donate with <a href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">PayPal</a>.</p>
        </div>
      </div>
    </section>
  )
}

function Gift({ dogs }: { dogs: Dog[] }) {
  const gdogs = dogs.filter(d => d.available_for_gift)
  const [chosen, setChosen] = useState<string>('')
  const c = gdogs.find(d => d.slug === chosen)
  return (
    <section id="gift" className="gift-sec en-gift">
      <div className="section-head reveal">
        <h2>Adopt as a gift 🎁</h2>
        <p>Looking for a moving, meaningful gift for someone who loves dogs? Give them a virtual adoption of one of the dogs we rescued. With your one-time donation of ₪{GIFT_SUM}, the dog you choose gets everything they need — a safe roof, quality food, devoted medical care and an ocean of love.</p>
      </div>
      <div className="en-gift-points reveal">
        <div><b>📱 A moving surprise straight to their phone</b><span>On the day you choose, we send them a personal adoption message in the name of their new dog, together with your greeting and the adoption certificate.</span></div>
        <div><b>🐾 Personal updates from the dog</b><span>The person receiving the gift gets a personal update from the dog once a month, for a whole year.</span></div>
      </div>
      <div className="va-gallery">
        {gdogs.map(d => (
          <button key={d.id} type="button" className={`va-gdog reveal${chosen === d.slug ? ' on' : ''}`} onClick={() => setChosen(d.slug)}>
            {d.main_image && <img src={d.main_image} style={focusStyle(d)} alt={dogName(d)} loading="lazy" />}
            <span className="va-gdog-body"><b>{dogName(d)}</b><span>{d.tagline_en}</span><em>{chosen === d.slug ? '✓ Chosen' : 'Choose me'}</em></span>
          </button>
        ))}
      </div>
      <div className="en-go">
        {c
          ? <Link className="btn btn-gold" to={`/en/checkout?type=gift&dog=${c.slug}`}>🎁 Give {dogName(c)} as a gift · ₪{GIFT_SUM} →</Link>
          : <p className="en-hint">☝️ Choose a dog above to continue</p>}
      </div>
    </section>
  )
}

function Birthday() {
  const { data } = useBirthdayDog()
  const pay = usePayLinks()
  const dog = data?.dogs as (Dog & { active?: boolean }) | null | undefined
  if (!dog || dog.active === false) return null
  return (
    <section className="bday-home">
      <div className="bday-card reveal">
        {dog.main_image && <div className="bday-photo"><img src={dog.main_image} style={focusStyle(dog)} alt={`${dogName(dog)}'s birthday`} /></div>}
        <div className="bday-body">
          <span className="bday-tag">🎂 This month's birthday</span>
          <h2>It's <span>{dogName(dog)}</span>'s birthday!</h2>
          <p>Every month another dog at the shelter celebrates a birthday — and it's your chance to spoil them with a small gift that will make their day.</p>
          <a className="btn bday-btn" href={isTestMode() ? pay.grow_test : pay.grow_birthday} target="_blank" rel="noopener">Send {dogName(dog)} a birthday gift →</a>
        </div>
      </div>
    </section>
  )
}

function VolunteerStories() {
  const [all, setAll] = useState(false)
  const shown = all ? VOLUNTEER_STORIES_EN : VOLUNTEER_STORIES_EN.slice(0, 3)
  return (
    <div className="vol-stories reveal">
      <h3>What our volunteers say 💬</h3>
      <div className="vol-stories-grid">
        {shown.map(s => <figure key={s.name} className="vol-story"><blockquote>{s.text}</blockquote><figcaption>— {s.name}</figcaption></figure>)}
      </div>
      {!all && <button type="button" className="btn btn-outline-green" onClick={() => setAll(true)}>More stories ({VOLUNTEER_STORIES_EN.length - 3}) ↓</button>}
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    // saved in the admin inbox (פניות) and opened as a ready WhatsApp message
    supabase.from('contact_messages').insert({ name: get('name').slice(0, 80), phone: get('phone').slice(0, 20) || null, topic: `[EN] ${get('topic')}`.slice(0, 80), message: get('message').slice(0, 2000) || null })
      .then(({ error }) => { if (error) console.error('contact save failed', error.message) })
    const lines = ["Hi! I'm reaching out via the website 🐾", `Name: ${get('name')}`, get('phone') && `Phone: ${get('phone')}`, `Topic: ${get('topic')}`, get('message') && `Details: ${get('message')}`].filter(Boolean)
    window.open(wa(WA_TALI, lines.join('\n')), '_blank', 'noopener')
    setSent(true); form.reset()
  }
  return (
    <form className="contact-form reveal" id="contact-form" onSubmit={send}>
      <input name="name" placeholder="Full name" aria-label="Full name" required />
      <input name="phone" placeholder="Phone" aria-label="Phone" type="tel" required pattern="[0-9+\-\s\(\)]{9,20}" title="Phone number, so we can get back to you" />
      <select name="topic" aria-label="Topic">
        <option>I want to adopt a dog</option>
        <option>I want to volunteer</option>
        <option>I want to be a foster family</option>
        <option>Virtual adoption / gift</option>
        <option>Other</option>
      </select>
      <textarea name="message" placeholder="Tell us a little..." rows={3}></textarea>
      <button type="submit">Send 💬</button>
      <p className="form-hint">{sent ? '✓ Thank you! We received your message. If WhatsApp opened, tap "Send" there so it reaches us directly too.' : 'We receive your message, and it also opens as a ready WhatsApp message.'}</p>
    </form>
  )
}

export default function English() {
  // the <html> element is Hebrew/RTL for the rest of the site — switch it while this page is shown
  useEffect(() => {
    const html = document.documentElement
    html.lang = 'en'; html.dir = 'ltr'
    return () => { html.lang = 'he'; html.dir = 'rtl' }
  }, [])
  const [navOpen, setNavOpen] = useState(false)
  const dogs = useDogs()
  const team = useTeam()
  const counters = useCounters()
  const list = (dogs.data ?? []) as Dog[]
  usePageEffects()
  useEffect(() => { document.title = 'Lives of Others — Rescuing, Rehabilitating & Rehoming Abandoned Dogs in Israel' }, [])

  return (
    <div dir="ltr" lang="en" className="en-page">
      {/* ============ HEADER ============ */}
      <header className="site-header">
        <div className="wrap header-inner">
          <a href="#top" className="brand">
            <img src="/assets/img/logo.jpg" alt="Lives of Others" />
            <span className="brand-text">
              <strong className="brand-name">Lives of Others</strong>
              <span className="brand-sub">Rescue · Care · Rehabilitation</span>
            </span>
          </a>
          <nav className={`main-nav${navOpen ? ' open' : ''}`} onClick={() => setNavOpen(false)}>
            <a href="#dogs">Our Dogs</a>
            <a href="#virtual">Virtual Adoption</a>
            <a href="#gift">Gift</a>
            <a href="#homes">The Magical Homes</a>
            <a href="#about">About</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <Link className="lang-switch" to="/" lang="he">עברית</Link>
            <a className="btn-donate-top" href="#donate">Donate ❤</a>
            <button className="nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>☰</button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="wrap hero">
        <div className="hero-copy">
          <h1>Lives of Others<span className="hero-title-sub">Rescuing, treating and rehabilitating abandoned dogs</span></h1>
          <p className="hero-sub">We pull dogs out of the streets, the pounds and severe neglect — and give them food, medical care, a home, and above all: the feeling that they are loved.</p>
          <span className="hero-chip">🐾 The only rescue in Israel where the dogs live in homes — not cages</span>
          <div className="cta-row">
            <a href="#dogs" className="btn btn-blue">I want to adopt a dog</a>
            <a href="#donate" className="btn btn-gold">I want to donate</a>
            <a href="#volunteer" className="btn btn-green">I want to volunteer</a>
          </div>
          <a href="#virtual" className="btn btn-angel">Be my guardian angel — virtual adoption</a>
          <div className="social-row">
          <div className="social-row">
            <a href="https://wa.me/972546881116?text=Hi!%20I%27d%20love%20to%20help%20Lives%20of%20Others%20%F0%9F%90%BE" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
            </a>
            <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.3-.1 1.6-.1 4.8-.1zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.4a5.1 5.1 0 1 1 0 10.3 5.1 5.1 0 0 1 0-10.3zm0 2a3.1 3.1 0 1 0 0 6.3 3.1 3.1 0 0 0 0-6.3zm5.3-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" /></svg>
            </a>
          </div>
          </div>
        </div>
        <Tv />
      </section>

      {/* ============ COUNTERS ============ */}
      <section className="rescue-numbers counters-band">
        <div className="wrap">
          <div className="counters counters-strip reveal">
            {(counters.data?.value ?? []).map(c => (
              <div className="counter" key={c.label}>
                <div className="counter-num">{c.value.toLocaleString('en-US')}{c.suffix?.trim() === '₪' ? ' ₪' : c.suffix}</div>
                <div className="counter-label">{COUNTER_EN[c.label] ?? c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOGS ============ */}
      <section id="dogs" className="gift-sec en-dogs">
        <div className="section-head reveal">
          <h2>Meet our dogs</h2>
          <p>You can adopt — and if you can't, you can adopt virtually: a monthly sponsorship that covers food, vaccines and care.</p>
        </div>
        {dogs.error && <p role="alert">We couldn't load the dogs right now. Please refresh the page.</p>}
        <div className="gift-dogs2">
          {list.map(d => <DogCard key={d.id} d={d} />)}
        </div>
        <p className="dogs-note">All our adoptable dogs, with full profiles — <a href="https://yad4.co.il/organization/%D7%97%D7%99%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%90%D7%97%D7%A8%D7%99%D7%9D" target="_blank" rel="noopener">on our Yad4 page (Hebrew) →</a></p>
      </section>

      <Virtual dogs={list} />
      <Gift dogs={list} />
      <Birthday />

      {/* ============ ABOUT (same order as the Hebrew page: about → team → what makes us different → a new beginning) ============ */}
      <section id="about" className="about-band">
        <div className="wrap about">
          <div className="about-copy reveal">
            <h2>About us</h2>
            <p>Lives of Others was founded in 2016 by <strong>Tali Abadi and Dvora Atia</strong>, to rescue dogs from the streets and pounds across Israel.</p>
            <p>Lives of Others is a registered non-profit run entirely by volunteers, saving hundreds of dogs from euthanasia every year — to give them a second chance at life.</p>
            <div className="about-quote">
              <p>We believe in the sanctity of life and never put dogs down. Every dog that reaches us stays in our care, treated and loved — until adopted, or until a good old age.</p>
            </div>
          </div>
          <div className="about-video reveal">
            <video autoPlay muted loop playsInline preload="metadata" poster="/assets/img/montage-poster.jpg" aria-label="Moments from our work">
              <source src="/assets/video/montage-draft.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section id="team" className="team-band">
        <div className="wrap team">
          <div className="section-head reveal">
            <h2>Our team</h2>
            <p>Behind every rescue are people who gave their hearts — volunteers, caregivers and founders who live the mission every day.</p>
          </div>
          <div className="team-grid reveal">
            {team.data?.map(m => (
              <div className="team-member" key={m.id}>
                {m.photo && <img src={m.photo} alt={m.name_en || m.name} />}
                <span className="team-name">{m.name_en || m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="unique">
        <h2 className="reveal">What makes Lives of Others different</h2>
        <p className="reveal"><strong>Homes instead of cages.</strong> In our unique flagship project, the dogs live in <strong>Magical Homes</strong>. The Magical Homes are memorial projects for loved ones who fell and were murdered in the October 7 war — in these homes, the legacy of Staff Sgt. Adi Tzur, Reserve Master Sgt. Yair Katz and Shani Gabay lives on through saving dogs and giving to animals.</p>
        <div className="unique-video reveal">
          <iframe src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent('https://www.facebook.com/reel/2469672846859124')}&show_text=false&width=340&height=604&t=0`}
            title="Dvora: homes instead of cages (Hebrew)" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen />
        </div>
        <p className="video-caption">👆 Dvora, our co-founder: homes instead of cages (Hebrew)</p>
      </section>

      <section className="wrap story">
        <div className="story-video reveal">
          <iframe src="https://www.youtube-nocookie.com/embed/jO9JChY_ETM?rel=0" title="They were abandoned. We won't abandon them." loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        <div className="story-copy reveal">
          <h2>On the way to a new beginning</h2>
          <p className="story-lead">There is one moment when a dog understands he has been left alone. It's the moment trust breaks and his heart closes.</p>
          <p><strong>At Lives of Others we fight to rescue dogs from the field</strong>, so that this moment won't be the end of their story — only a step on the way to a new beginning.</p>
          <div className="cta-row"><a href="#donate" className="btn btn-gold">Donate to the dogs' rehabilitation →</a></div>
        </div>
      </section>

      {/* ============ MAGIC HOMES / MEMORIAL ============ */}
      <section id="homes" className="homes">
        <div className="wrap homes-inner">
          <span className="homes-eyebrow">IN THEIR MEMORY · LIVES THAT KEEP SAVING LIVES</span>
          <h2>The Magical Homes</h2>
          <p className="homes-sub">The Magical Homes are memorial projects honoring loved ones who were murdered and fell in the war of October 7th. In these homes their legacy lives on — through saving lives and giving to animals.</p>
          <div className="homes-grid">
            <article className="home-card reveal">
              <img src="/assets/img/memorial-adi-tzur.jpg" alt="Staff Sergeant Adi Tzur" />
              <div className="home-card-body">
                <h3>The Magical Home in memory of Staff Sgt. Adi Tzur</h3>
                <p>A hero of Israel who defended Kibbutz Kissufim with his body on October 7th. Adi chose Leni — a dog no one else dared approach — and rehabilitated her with endless love.</p>
                <button onClick={() => openModal('modal-adi')}>Read the full story →</button>
              </div>
            </article>
            <article className="home-card reveal">
              <img src="/assets/img/memorial-shani-gabay.jpg" alt="Shani Gabay" />
              <div className="home-card-body">
                <h3>The Magical Home in memory of Shani Gabay</h3>
                <p>A ray of light and compassion, murdered at the Nova festival. Shani's great dream was to open a shelter of her own — and we make it come true for her, every single day.</p>
                <button onClick={() => openModal('modal-shani')}>Read the full story →</button>
              </div>
            </article>
            <article className="home-card reveal">
              <img src="/assets/img/memorial-yair-katz.jpg" alt="Yair Katz with Bruce" />
              <div className="home-card-body">
                <h3>The Magical Home in memory of Yair Katz</h3>
                <p>Even from the battlefield in Gaza, Yair never forgot the lost souls he met. Bruce, the pitbull he adopted, carries his legacy on — in his brother's home.</p>
                <button onClick={() => openModal('modal-yair')}>Read the full story →</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Memorial modals */}
      <dialog id="modal-adi" className="memorial-modal" onClick={closeOnBackdrop}>
        <div className="memorial-modal-inner">
          <button className="memorial-close" aria-label="Close" onClick={closeModal}>✕</button>
          <span className="memorial-eyebrow">THE MAGICAL HOMES · IN THEIR MEMORY</span>
          <h3>In memory of Staff Sgt. Adi Tzur — a hero of Israel</h3>
          <img className="memorial-portrait" src="/assets/img/memorial-adi-tzur.jpg" alt="Staff Sergeant Adi Tzur" />
          <p>Adi Tzur was a fighter with a great soul and extraordinary courage. On October 7th, 2023, Adi defended Kibbutz Kissufim with his own body, in a heroic battle against dozens of terrorists. His actions saved many lives, as he showed remarkable bravery until his very last breath. Beyond being a brave soldier, Adi was a person who saw the most invisible souls — the ones that need compassion and patience most.</p>
          <p><strong>Choosing Leni: a story of patience and love.</strong> Adi's bond with Lives of Others was woven through Leni, a dog who had suffered terrible abuse and waited long years at the shelter for someone to open their heart to her. Leni was fearful — a dog no one dared approach — but Adi chose her precisely because of her struggles. With the patience of an angel and endless love, he rehabilitated her and gave her a sense of safety she had never known.</p>
          <p><strong>A light that continues in the Tzur family home.</strong> After Adi fell, Leni was left with an enormous void in her heart. In a profoundly moving gesture, Adi's parents chose to adopt Leni into their home. Today Leni lives wrapped in the embrace of the Tzur family — she is their comfort and they are her safety. She is a living memory of Adi's love, and the fulfillment of his unwritten will: to help those who struggle most.</p>
          <p>The Magical Home built in his memory is where Adi's legacy lives on. Here we give hope to the dogs nobody wanted, believing that — just like Leni — every soul deserves a "hero" who believes in it.</p>
          <div className="memorial-actions">
            <a href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener" className="btn btn-sm btn-orange">Donate in their memory</a>
            <a href="#dogs" onClick={closeModal} className="btn btn-sm btn-outline-green">Meet the dogs</a>
          </div>
        </div>
      </dialog>

      <dialog id="modal-shani" className="memorial-modal" onClick={closeOnBackdrop}>
        <div className="memorial-modal-inner">
          <button className="memorial-close" aria-label="Close" onClick={closeModal}>✕</button>
          <span className="memorial-eyebrow">THE MAGICAL HOMES · IN THEIR MEMORY</span>
          <h3>In memory of Shani Gabay — the light that keeps saving lives</h3>
          <img className="memorial-portrait" src="/assets/img/memorial-shani-gabay.jpg" alt="Shani Gabay" />
          <p>Shani Gabay was a ray of compassion with a smile that never ended. On October 7th, 2023, Shani was murdered at the Nova festival in Re'im, after long hours in which she tried to save others and escape. She was only 26 — full of life, with a huge heart that was always open to the weakest creatures of all: abandoned dogs.</p>
          <p><strong>Shani's dream, and the heart that stayed with her family.</strong> In her life, Shani didn't just love dogs — she lived them. She volunteered, rescued dogs from the streets and cared for every four-legged soul that crossed her path. Her own dogs were family in every sense, her anchor and her daily joy. After she was taken, in a gesture of pure love and continuity, her parents adopted her dogs. Today the dogs Shani so loved live in her family's embrace — her parents' greatest comfort, a living, breathing memory of her endless love.</p>
          <p><strong>Continuing Shani's path.</strong> Shani's great dream, the one she always talked about, was to build a shelter of her own — a place where dogs could heal, run free and feel truly loved. To fulfill the dream she never got to realize, Lives of Others built "The Home in Memory of Shani Gabay".</p>
          <p>It is a place of hope, where Shani's spirit — a spirit of unconditional giving and joy — beats in every wagging tail. Shani believed every dog deserves a chance, and we are here to make sure that chance comes true. Every time a dog from her home finds a family, we know Shani is smiling from above — because her dream keeps living here, with us, every single day.</p>
          <div className="memorial-actions">
            <a href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener" className="btn btn-sm btn-orange">Donate in their memory</a>
            <a href="#dogs" onClick={closeModal} className="btn btn-sm btn-outline-green">Meet the dogs</a>
          </div>
        </div>
      </dialog>

      <dialog id="modal-yair" className="memorial-modal" onClick={closeOnBackdrop}>
        <div className="memorial-modal-inner">
          <button className="memorial-close" aria-label="Close" onClick={closeModal}>✕</button>
          <span className="memorial-eyebrow">THE MAGICAL HOMES · IN THEIR MEMORY</span>
          <h3>Yair's Home — our beating heart</h3>
          <img className="memorial-portrait" src="/assets/img/memorial-yair-katz.jpg" alt="Yair Katz with Bruce" />
          <p><strong>Yair's spark: compassion that crosses borders.</strong> Yair Katz carried an endless love for dogs — a love that never dimmed, even in the most challenging moments. Tali, our director, tells how even from the battlefield in Gaza, Yair never forgot the lost souls he met along the way. He reached out and asked for her help to extend a hand to helpless dogs left without shelter among the ruins. In a moving collaboration, Tali helped rescue the dogs Yair had met, giving them the safety they so desperately needed. That was the essence of Yair: seeing the light, and the need for help, wherever his feet took him.</p>
          <p><strong>Bruce's heart: from the shelter to a family's embrace.</strong> The story of Bruce, the beloved pitbull, is living testimony to the deep bond between Yair and Lives of Others. Bruce was a long-time resident of the shelter — a big dog with a heart of gold who waited years for someone to see his inner beauty beyond the stigma. Yair was his adopter: the one who opened his heart and became his best friend.</p>
          <p>After Yair fell, Bruce was not left alone. In a moving act that closed a circle of kindness, Yair's brother chose to continue his path and adopted Bruce. Today Bruce is much more than an adopted dog — he is a living, breathing, tail-wagging memory of Yair. He reminds us all that true love never ends: it is passed on, from the brother who fell to the brother who carries on, inside a family that wraps him in warmth and comfort.</p>
          <p>Our shelter is Yair's home — a place where every dog gets a second chance, exactly as Yair gave Bruce.</p>
          <div className="memorial-actions">
            <a href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener" className="btn btn-sm btn-orange">Donate in their memory</a>
            <a href="#dogs" onClick={closeModal} className="btn btn-sm btn-outline-green">Meet the dogs</a>
          </div>
        </div>
      </dialog>

      {/* ============ RESCUES ============ */}
      <section id="stories" className="wrap rescues">
        <div className="section-head reveal">
          <h2>Stories from the heart</h2>
          <p>Real stories from our Facebook page. Same dog, a different life.</p>
        </div>
        <div className="rescue-grid">
          <article className="rescue-card reveal">
            <img src="/assets/img/story-dogpark.jpg" alt="Roni, king of the Magical Home" />
            <strong>Roni &amp; Luna — king and queen of the Magical Home</strong>
            <p>Roni and Luna grew up together with a lonely elderly man; after he passed away they were thrown into the pound at age 11. We knew their chances of finding a home were slim — but we couldn't let them die without a loving hand. They became the very first residents of the Magical Home named after Adi Tzur, were cared for with endless devotion, and lived far beyond expectations — to almost 14. When Roni's day came, the vet came to him, at home, with all of us hugging him goodbye. That is our promise to every dog: a good old age, at home, with love.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/memorial-yair-katz.jpg" alt="Yair and Bruce" />
            <strong>Bruce — love that passes on</strong>
            <p>A pitbull with a heart of gold, who waited years at the shelter for someone to see past the stigma. Yair Katz was the one who opened his heart and became his best friend. After Yair fell in Gaza, his brother adopted Bruce — because true love, it turns out, simply passes on.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/tali-malinois.jpg" alt="A rescued dog with our founder" />
            <strong>Leni — the dog Adi chose</strong>
            <p>Leni suffered terrible abuse and waited years at the shelter, so fearful that no one dared approach her. Adi Tzur chose her precisely because of her struggles, and with the patience of an angel gave her back her trust in people. After Adi fell defending Kibbutz Kissufim, his parents adopted Leni — today she is their comfort, and they are her safety.</p>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-trail.jpg" alt="Rani" />
            <strong>Rani — this time it's forever</strong>
            <p>Almost three years ago we pulled Rani out of the pound — one of the sweetest, kindest dogs we've ever met. He was adopted, and we were overjoyed for him. Then came the phone call no rescue wants to get: Rani is coming back. Not because of him — he did nothing wrong. Rani is 4, good and full of love, great with everyone. Now he's looking for one person who will truly promise him: this time it's forever.</p>
            <a className="btn btn-sm btn-orange" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Rani%20%F0%9F%90%BE" target="_blank" rel="noopener">I want to be Rani's home</a>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/adopt-me-cafe.jpg" alt="Bell" />
            <strong>Bell — the angel dog</strong>
            <p>Amazing with people, kids, babies and all dogs. Indifferent to cats, perfectly house-trained, happy to stay home alone, loves to cuddle and to play. Two years old, healthy and fully cared for. Bell reads every situation and approaches everything with love — she will be an amazing family member in any home.</p>
            <a className="btn btn-sm btn-orange" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Bell%20%F0%9F%90%BE" target="_blank" rel="noopener">I want to adopt Bell</a>
          </article>
          <article className="rescue-card reveal">
            <img src="/assets/img/dog-tub.jpg" alt="Aki on rescue day" />
            <strong>Aki — her happy ending is still ahead</strong>
            <p>Rescued from a junkyard as a puppy. Today she is a young, healthy dog who is amazing with people and kids — and the next chapter of her story, a forever home, is still waiting to be written. Maybe with you?</p>
          </article>
        </div>
        <p className="dogs-note">Stories from <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">our Facebook page</a> — where there's a new update almost every day 🐾</p>
      </section>

      {/* ============ VOLUNTEER ============ */}
      <section id="volunteer" className="volunteer-band">
        <div className="wrap volunteer">
          <div className="section-head reveal">
            <h2>We need you</h2>
            <p>Want to volunteer with us? Our dogs are waiting for you — waiting for the gate to open, to go out walking in the open fields and get a pat. For them, a walk with you is the highlight of the day. For you, it's the perfect chance to disconnect from routine, fill your heart and go home with a smile.</p>
          </div>
          <img className="vol-banner reveal" src="/assets/img/dog-pil-1.jpg" alt="Pil waiting for volunteers" style={{ objectPosition: '50% 17%' }} />
          <div className="vol-info reveal">
            <div className="vol-info-card"><span className="vol-icon">📍</span><strong>Where?</strong><p>The Lives of Others shelter, Ramat Efal.<br /><span className="vol-map-note">🗺️ <strong>The Magical Home in memory of Staff Sgt. Adi Tzur</strong> · Navigate: <a href={WAZE_SHELTER} target="_blank" rel="noopener">Waze</a> · <a href={MAPS_SHELTER} target="_blank" rel="noopener">Google Maps</a></span></p></div>
            <div className="vol-info-card"><span className="vol-icon">🗓️</span><strong>When?</strong><p>Every day of the week, by arrangement.</p></div>
            <div className="vol-info-card"><span className="vol-icon">👥</span><strong>Who is it for?</strong><p>Volunteers aged 16 and up. On Saturdays there are family walks for parents and children.</p></div>
          </div>
          <div className="vol-notes reveal">
            <strong>A few things our dogs asked us to mention 🐾</strong>
            <ul>
              <li>Keep in mind that we're a bit naughty and weigh over 25 kg.</li>
              <li>Don't forget to bring: closed shoes for walking in the field, comfortable clothes that can get dirty, and a water bottle.</li>
              <li>You're welcome — even encouraged — to bring dog treats and spoil us during the walk.</li>
            </ul>
          </div>
          <VolunteerStories />
          <div className="vol-cta reveal">
            <a className="btn btn-green" href={wa(WA_TALI, "Hi! I'd like to volunteer with Lives of Others 🐾")} target="_blank" rel="noopener">I want to volunteer</a>
          </div>
          <div className="vol-more reveal">
            <p>Want to help in other ways — marketing, fundraising, or renovating and maintaining our homes? <strong>Your help can change the dogs' lives</strong></p>
            <a href="#contact" className="btn btn-gold">Tell us how you'd like to help →</a>
          </div>
        </div>
      </section>

      {/* ============ DONATE ============ */}
      <section id="donate" className="wrap donate">
        <div className="section-head reveal">
          <h2>We exist only thanks to donations and volunteers</h2>
          <p>We need your help to keep funding food, medical care and the upkeep of the Magical Homes. Without your support, we cannot keep fighting for the lives of abandoned dogs.</p>
        </div>
        <div className="donate-grid">
          <div className="donate-card reveal">
            <span className="d-icon">🌍</span>
            <strong>PayPal — from anywhere</strong>
            <p>Fast, secure donation from anywhere in the world.</p>
            <a className="d-link" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">paypal.me/savingthedogs →</a>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">💳</span>
            <strong>Credit card (Israel)</strong>
            <p>Secure one-time or monthly donation in ILS.</p>
            <a className="d-link" href="http://donation.lives-of-others.org/truma" target="_blank" rel="noopener">Secure donation page →</a>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">📱</span>
            <strong>Bit / PayBox (Israel)</strong>
            <p>Bit: <b>052-8296622</b><br />PayBox: <b>054-6881116</b></p>
            <a className="d-link" href="https://links.payboxapp.com/mr8NxOzWKUb" target="_blank" rel="noopener">Pay with PayBox →</a>
          </div>
          <div className="donate-card reveal">
            <span className="d-icon">🏦</span>
            <strong>Bank transfer</strong>
            <p className="bank-details">Beneficiary: <b>Lives of Others</b><br />Mizrahi-Tefahot Bank (20)<br />Branch 539 · Account: <b>497218</b></p>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="contact-copy reveal">
            <h2>Want to adopt? Volunteer?</h2>
            <p>Fill in your details and we'll get back to you — or message us directly on WhatsApp. Before every adoption we hold a get-to-know-you call and a matching questionnaire, to make sure every dog reaches the right home for them.</p>
            <p>📍 Ramat Efal, Israel · ☎ Tali +972-54-688-1116</p>
            <a className="btn-wa" href={wa(WA_TALI, "Hi! I'm reaching out via the website 🐾")} target="_blank" rel="noopener">💬 Talk to us on WhatsApp</a>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <img src="/assets/img/logo.jpg" alt="Lives of Others" />
          <div className="footer-brand">
            <strong>Lives of Others · חיים של אחרים</strong>
            <span>Registered Israeli non-profit (No. 580754083) · Dog rescue, care &amp; rehabilitation · Run by volunteers since 2016 · Ramat Efal, Israel</span>
          </div>
          <div className="footer-links">
            <a className="donate" href="#donate">Donate</a>
            <a href="#dogs">Adopt</a>
            <a href="#virtual">Virtual adoption</a>
            <a href="#gift">Gift</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#homes">The Magical Homes</a>
            <Link to="/privacy">Privacy &amp; terms (Hebrew)</Link>
            <Link to="/en/accessibility">Accessibility</Link>
            <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a className="wa-float" href="https://wa.me/972546881116?text=Hi!%20I%27m%20reaching%20out%20via%20the%20website%20%F0%9F%90%BE" target="_blank" rel="noopener" aria-label="Talk to us on WhatsApp" title="Talk to us on WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
      </a>
    </div>
  )
}
