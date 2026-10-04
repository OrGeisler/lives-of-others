import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { WA_ADOPT, wa } from '../../lib/links'
import AngelButton from './AngelButton'

export default function Hero() {
  const video = useRef<HTMLVideoElement>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => {
    const v = video.current
    if (!v) return
    if (v.paused) void v.play(); else v.pause() // state follows the video's own play/pause events
  }

  const toggleSound = () => {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) void v.play()
    setSoundOn(!v.muted)
  }

  return (
    <>
      <section id="top" className="wrap hero">
        <div className="hero-copy">
          <h1>חיים של אחרים<span className="hero-title-sub">עמותה להצלה, טיפול ושיקום כלבים נטושים</span></h1>
          <p className="hero-sub">אנחנו מחלצים כלבים מהרחוב, מההסגרים וממצבי הזנחה קשים — נותנים להם אוכל, טיפול רפואי, בית, ומעל הכול: את ההרגשה שהם אהובים.</p>
          <span className="hero-chip">🐾 העמותה היחידה בישראל שבה הכלבים גרים בבתים — לא בכלובים</span>
          <div className="cta-row">
            <Link to="/dogs" className="btn btn-orange">אני רוצה לאמץ כלב</Link>
            <Link to="/donate" className="btn btn-gold">אני רוצה לתרום</Link>
            <Link to="/volunteer" className="btn btn-green">אני רוצה להתנדב</Link>
          </div>
          <AngelButton />
          <div className="social-row">
            <a href={wa(WA_ADOPT, 'היי! אני רוצה לעזור לעמותת חיים של אחרים 🐾')} target="_blank" rel="noopener" aria-label="וואטסאפ" title="וואטסאפ">
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
            </a>
            <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener" aria-label="פייסבוק" title="פייסבוק">
              <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href="https://www.instagram.com/lives.of.others.rescue" target="_blank" rel="noopener" aria-label="אינסטגרם" title="אינסטגרם">
              <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.3-.1 1.6-.1 4.8-.1zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.4a5.1 5.1 0 1 1 0 10.3 5.1 5.1 0 0 1 0-10.3zm0 2a3.1 3.1 0 1 0 0 6.3 3.1 3.1 0 0 0 0-6.3zm5.3-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" /></svg>
            </a>
          </div>
        </div>
        {/* 24.9 עמ' 1: סרטון ערוץ 12 ברקע בתוך מסגרת טלוויזיה של פעם */}
        <figure className="tv">
          <div className="tv-antenna" aria-hidden="true"></div>
          <div className="tv-body">
            <div className="tv-screen">
              <video onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} ref={video} autoPlay muted loop playsInline preload="auto" poster="/assets/img/channel12-poster.jpg" aria-label="הכתבה ששודרה בערוץ 12">
                <source src="/assets/video/channel12.mp4" type="video/mp4" />
              </video>
              <div className="tv-controls">
                <button className="tv-sound" type="button" aria-pressed={!playing} onClick={togglePlay}>
                  {playing ? '⏸ עצירה' : '▶ הפעלה'}
                </button>
                <button className="tv-sound" type="button" aria-pressed={soundOn} onClick={toggleSound}>
                  {soundOn ? '🔇 השתקה' : '🔊 להפעלת קול'}
                </button>
              </div>
            </div>
            <div className="tv-panel" aria-hidden="true"><span className="tv-knob"></span><span className="tv-knob"></span><span className="tv-grill"></span></div>
          </div>
          <div className="tv-legs" aria-hidden="true"><span></span><span></span></div>
          <figcaption className="tv-caption">📺 הכתבה ששודרה בערוץ 12</figcaption>
        </figure>
      </section>
      {/* wave divider into rescue-numbers */}
      <div className="wave" style={{ background: 'var(--bg)' }}><svg viewBox="0 0 1440 46" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path fill="var(--navy)" d="M0,24 C240,48 480,0 720,16 C960,32 1200,48 1440,20 L1440,46 L0,46 Z" /></svg></div>
    </>
  )
}
