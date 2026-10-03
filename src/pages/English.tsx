import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { usePageEffects } from '../lib/usePageEffects'
import { WA_TALI } from '../lib/links'

// English one-pager (port of en/index.html). Rendered OUTSIDE the Hebrew Layout: own LTR header/footer.

function openModal(id: string) {
  (document.getElementById(id) as HTMLDialogElement | null)?.showModal()
}
function closeModal(e: MouseEvent<HTMLElement>) {
  e.currentTarget.closest('dialog')?.close()
}
function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
  if (e.target === e.currentTarget) e.currentTarget.close()
}
function sendContact(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const f = new FormData(e.currentTarget)
  const get = (k: string) => String(f.get(k) ?? '').trim()
  const lines = [
    "Hi! I'm reaching out via the website 🐾",
    `Name: ${get('name')}`,
    get('phone') && `Phone: ${get('phone')}`,
    `Topic: ${get('topic')}`,
    get('message') && `Details: ${get('message')}`,
  ].filter(Boolean)
  window.open(`https://wa.me/${WA_TALI}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener')
}

export default function English() {
  // the <html> element is Hebrew/RTL for the rest of the site — switch it while this page is shown
  useEffect(() => {
    const html = document.documentElement
    html.lang = 'en'; html.dir = 'ltr'
    return () => { html.lang = 'he'; html.dir = 'rtl' }
  }, [])
  const [navOpen, setNavOpen] = useState(false)
  usePageEffects()
  useEffect(() => {
    document.title = 'Lives of Others — Rescuing, Rehabilitating & Rehoming Abandoned Dogs in Israel'
  }, [])

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
            <a href="#about">About</a>
            <a href="#homes">The Magical Homes</a>
            <a href="#dogs">Our Dogs</a>
            <a href="#sponsor">Virtual Adoption</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <Link className="lang-switch" to="/" lang="he">עברית</Link>
            <a className="btn-donate-top" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">Donate ❤</a>
            <button className="nav-toggle" aria-label="Menu" onClick={() => setNavOpen(o => !o)}>☰</button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="wrap hero">
        <div className="hero-copy">
          <span className="hero-chip">🐾 The only rescue in Israel where dogs live in homes — not cages</span>
          <h1>Lives of Others —<br />Rescuing Abandoned Dogs, Giving Them a Second Life</h1>
          <p className="hero-sub">We pull dogs out of the streets, kill-shelters and severe neglect — and give them food, medical care, a home, and above all: the feeling that they are loved.</p>
          <div className="cta-row">
            <a href="#dogs" className="btn btn-orange btn-hero-main">I want to save a dog</a>
            <a href="#volunteer" className="btn btn-green">I want to volunteer</a>
            <a href="#donate" className="btn btn-blue">I want to donate</a>
          </div>
          <div className="social-row">
            <a href="https://wa.me/972546881116?text=Hi!%20I%27d%20love%20to%20help%20Lives%20of%20Others%20%F0%9F%90%BE" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.3z" /></svg>
            </a>
            <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href="https://www.instagram.com/life_of_others_israel/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.3-.1 1.6-.1 4.8-.1zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.4a5.1 5.1 0 1 1 0 10.3 5.1 5.1 0 0 1 0-10.3zm0 2a3.1 3.1 0 1 0 0 6.3 3.1 3.1 0 0 0 0-6.3zm5.3-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" /></svg>
            </a>
          </div>
        </div>
        <img className="hero-photo" src="/assets/img/hero-two-dogs.jpg" alt="Two of our rescue dogs on a walk" />
      </section>

      {/* ============ IMPACT ============ */}
      <section className="impact">
        <div className="wrap impact-grid">
          <div className="stat"><span className="stat-num">2016</span><span className="stat-label">Founded</span></div>
          <div className="stat"><span className="stat-num">100s</span><span className="stat-label">of dogs saved from euthanasia every year</span></div>
          <div className="stat"><span className="stat-num">3</span><span className="stat-label">Magical Homes — no cages</span></div>
          <div className="stat"><span className="stat-num">0</span><span className="stat-label">dogs put down. Ever.</span></div>
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="wrap story">
        <img className="story-photo reveal" src="/assets/img/foster-couch.jpg" alt="A rescue dog on the couch with children in her foster home" />
        <div className="story-copy reveal">
          <h2>Want to help save a dog?</h2>
          <p>There is one moment when a dog understands he has been left behind. It is the moment trust breaks and his heart closes.</p>
          <p><strong>At Lives of Others, we fight so that this moment will not be the end of their story.</strong> Every day we rescue dogs from the streets, from kill-shelters and from severe neglect. We give them food, medical care, a home — and above all, the feeling that they are loved.</p>
          <div className="cta-row">
            <a href="#donate" className="btn btn-sm btn-orange">I want to donate</a>
            <a href="#volunteer" className="btn btn-sm btn-outline-green">I want to volunteer</a>
            <a href="#dogs" className="btn btn-sm btn-outline-orange">I want to help save a dog</a>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="about-band">
        <div className="wrap about">
          <div className="about-copy reveal">
            <h2>About Us</h2>
            <p>Lives of Others was founded in 2016 by <strong>Tali Abadi and Dvora Atia</strong>, with one mission: to rescue dogs from the streets and kill-shelters across Israel.</p>
            <p>We are a registered non-profit, run entirely by volunteers, saving hundreds of dogs from euthanasia every year — giving each of them a second chance at life.</p>
            <div className="about-quote">
              <p>We believe in the sanctity of life and never put dogs down. Every dog that reaches us stays under our care, loved and looked after — until adopted, or until the end of a long, happy life.</p>
            </div>
          </div>
          <div className="about-grid reveal">
            <img src="/assets/img/tali-malinois.jpg" alt="Our founder with a rescued dog" />
            <img src="/assets/img/volunteers.jpg" alt="Volunteers with a dog at the shelter home" />
            <img src="/assets/img/dog-tub.jpg" alt="A rescued dog on his first day with us" />
            <img src="/assets/img/dog-trail.jpg" alt="One of our dogs on a nature walk" />
          </div>
        </div>
      </section>

      {/* ============ UNIQUE + VIDEO ============ */}
      <section className="unique">
        <h2 className="reveal">What makes us different?</h2>
        <p className="reveal">Our flagship project says it all: <strong>homes instead of cages.</strong> Our dogs live in three "Magical Homes". Instead of waiting behind bars, they live in warm houses that give them safety and a sense of family.</p>
        <div className="video-frame reveal">
          <video controls preload="metadata" poster="/assets/img/story-dogpark.jpg">
            <source src="/assets/video/channel12.mp4" type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
        <p className="video-caption">👆 The story about us on Israel's Channel 12 (Hebrew)</p>
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

      {/* ============ DOGS ============ */}
      <section id="dogs" className="wrap dogs">
        <div className="section-head reveal">
          <h2>Our dogs are looking for a home</h2>
          <p>Each of them has come a long way. You can adopt — and if you can't, you can adopt virtually: a monthly sponsorship that covers food, vaccines and care.</p>
        </div>
        <div className="dogs-grid">
          <article className="dog-card reveal">
            <img src="/assets/img/story-dogpark.jpg" alt="Luz" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Luz</span><span className="dog-meta">11 years old</span></div>
              <p className="dog-bio">Calm, gentle, house-trained and great with people, kids and dogs. He was promised a home — and they cancelled. Now it's your turn not to give up on him.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Luz%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/puppy.jpg" alt="Gal" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Gal</span><span className="dog-meta">5-month puppy</span></div>
              <p className="dog-bio">Gal doesn't need fixing — he needs a childhood. A small, gentle, clever puppy full of trust, currently growing up at the shelter.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Gal%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/dog-shepherd.jpg" alt="Johnny" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Johnny</span><span className="dog-meta">Needs a quiet home</span></div>
              <p className="dog-bio">Some people understand the beauty of quiet — Johnny needs exactly those people. His foster is ending, and he needs a real home.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Johnny%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/foster-couch.jpg" alt="Aki" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Aki</span><span className="dog-meta">Almost 2 years old</span></div>
              <p className="dog-bio">Rescued from a junkyard. Amazing with people and children — still waiting for her happy ending to arrive.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Aki%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/adopt-me-cafe.jpg" alt="Bell" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Bell</span><span className="dog-meta">Waiting for a family</span></div>
              <p className="dog-bio">You don't have to be perfect to adopt Bell. You just have to be the ones who won't give up on her.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Bell%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/hero-two-dogs.jpg" alt="Bruno and Layla" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Bruno &amp; Layla</span><span className="dog-meta">7 years old · a pair</span></div>
              <p className="dog-bio">Raised in a home since they were a month old, abandoned together at a shelter. Calm, well-trained and people-loving — looking for a home that will take them both.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Bruno%20and%20Layla%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt us</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/dog-tub.jpg" alt="Omri" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Omri</span><span className="dog-meta">Worth the wait</span></div>
              <p className="dog-bio">They say the best things reveal themselves slowly — Omri is exactly like that. Give him a moment, and he'll steal your heart.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20adopt%20Omri%20%F0%9F%90%BE" target="_blank" rel="noopener">Adopt me</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
          <article className="dog-card reveal">
            <img src="/assets/img/dog-car-kid.jpg" alt="Zoom" />
            <div className="dog-card-body">
              <div className="dog-name-row"><span className="dog-name">Zoom</span><span className="dog-meta">Foster needed</span></div>
              <p className="dog-bio">We pay 1,200 ILS a month to a foster family for Zoom! All he needs is a temporary home and an open heart.</p>
              <div className="dog-actions">
                <a className="dog-adopt" href="https://wa.me/972528296622?text=Hi!%20I%27d%20like%20to%20foster%20Zoom%20%F0%9F%90%BE" target="_blank" rel="noopener">I'll foster</a>
                <a className="dog-sponsor" href="#sponsor">Sponsor</a>
              </div>
            </div>
          </article>
        </div>
        <p className="dogs-note">* Photos are from the organization's daily work. All adoptable dogs with full, up-to-date profiles — <a href="https://yad4.co.il/organization/%D7%97%D7%99%D7%99%D7%9D%20%D7%A9%D7%9C%20%D7%90%D7%97%D7%A8%D7%99%D7%9D" target="_blank" rel="noopener">on our Yad4 page →</a></p>
      </section>

      {/* ============ SPONSOR ============ */}
      <section id="sponsor" className="sponsor">
        <div className="wrap sponsor-inner">
          <div className="sponsor-copy reveal">
            <h2>Virtual Adoption</h2>
            <p>Not everyone can open their home — but everyone can open their heart. Pick a dog from the gallery and accompany them closely with a monthly sponsorship: you'll get updates, photos and videos — and they'll get everything they need.</p>
            <div className="tier-grid">
              <a className="tier" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">
                <div className="tier-amount">$15</div>
                <div className="tier-desc">a month · a bag of food</div>
              </a>
              <a className="tier tier-featured" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">
                <div className="tier-badge">Most popular</div>
                <div className="tier-amount">$30</div>
                <div className="tier-desc">a month · food + vaccines</div>
              </a>
              <a className="tier" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">
                <div className="tier-amount">$60</div>
                <div className="tier-desc">a month · full medical care</div>
              </a>
            </div>
          </div>
          <div className="impact-box reveal">
            <h3>What does your donation do?</h3>
            <div className="impact-line"><span className="impact-amount">$45</span><span>a bag of food that feeds a dog for a month</span></div>
            <div className="impact-line"><span className="impact-amount">$60</span><span>vaccines and preventive care for a rescued dog</span></div>
            <div className="impact-line"><span className="impact-amount">$140</span><span>life-saving veterinary treatment</span></div>
            <div className="impact-line"><span className="impact-amount">$330</span><span>a full month of a warm home for a rescued dog</span></div>
            <a href="#donate" className="btn btn-sm">I want to donate now</a>
          </div>
        </div>
      </section>

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
            <h2>Come volunteer</h2>
            <p>We run entirely on volunteers — in Ramat Efal and across Israel. Every pair of hands, and every heart, makes a real difference.</p>
          </div>
          <div className="vol-grid">
            <div className="vol-card reveal">
              <span className="vol-icon">🦮</span>
              <strong>Dog walks</strong>
              <p>An hour a week of walking and playing in the fields of Ramat Efal — and very happy ears.</p>
            </div>
            <div className="vol-card reveal">
              <span className="vol-icon">🏠</span>
              <strong>Foster family</strong>
              <p>A temporary home for a recovering dog — until a forever home is found. We fund and support everything.</p>
            </div>
            <div className="vol-card reveal">
              <span className="vol-icon">🚗</span>
              <strong>Transport</strong>
              <p>Driving dogs to the vet, to adoptions and to the Magical Homes.</p>
            </div>
            <div className="vol-card reveal">
              <span className="vol-icon">📸</span>
              <strong>Photo &amp; content</strong>
              <p>Photos and videos that help every dog find a family faster.</p>
            </div>
          </div>
          <div className="vol-cta reveal">
            <a className="btn btn-green" href="https://wa.me/972546881116?text=Hi!%20I%27d%20like%20to%20volunteer%20with%20Lives%20of%20Others%20%F0%9F%90%BE" target="_blank" rel="noopener">I want to volunteer</a>
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
            <a className="btn-wa" href="https://wa.me/972546881116?text=Hi!%20I%27m%20reaching%20out%20via%20the%20website%20%F0%9F%90%BE" target="_blank" rel="noopener">💬 Talk to us on WhatsApp</a>
          </div>
          <form className="contact-form reveal" id="contact-form" onSubmit={sendContact}>
            <input name="name" placeholder="Full name" required />
            <input name="phone" placeholder="Phone" type="tel" />
            <select name="topic">
              <option>I want to adopt a dog</option>
              <option>I want to volunteer</option>
              <option>I want to be a foster family</option>
              <option>Monthly sponsorship / virtual adoption</option>
              <option>Other</option>
            </select>
            <textarea name="message" placeholder="Tell us a little..." rows={3}></textarea>
            <button type="submit">Send via WhatsApp 💬</button>
            <p className="form-hint">The form opens as a ready WhatsApp message — nothing is stored on this site.</p>
          </form>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <img src="/assets/img/logo.jpg" alt="Lives of Others" />
          <div className="footer-brand">
            <strong>Lives of Others · חיים של אחרים</strong>
            <span>Registered Israeli non-profit · Dog rescue, care &amp; rehabilitation · Run by volunteers since 2016 · Ramat Efal, Israel</span>
          </div>
          <div className="footer-links">
            <a className="donate" href="https://www.paypal.me/savingthedogs" target="_blank" rel="noopener">Donate</a>
            <a href="#dogs">Adopt</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#homes">The Magical Homes</a>
            <a href="https://www.facebook.com/lifeofothers" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/life_of_others_israel/" target="_blank" rel="noopener">Instagram</a>
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
