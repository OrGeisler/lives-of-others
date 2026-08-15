// חיים של אחרים — main.js

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.addEventListener('click', e => {
    if (e.target.tagName === 'A') mainNav.classList.remove('open');
  });
}

// Memorial modals (<dialog>)
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.openModal);
    if (dlg) dlg.showModal();
  });
});
document.querySelectorAll('dialog.memorial-modal, dialog.dog-modal').forEach(dlg => {
  dlg.querySelectorAll('[data-close-modal]').forEach(b =>
    b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => {
    if (e.target === dlg) dlg.close(); // click on backdrop only
  });
});

// Contact form → WhatsApp message
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const topic = form.querySelector('[name="topic"]').value;
    const msg = form.querySelector('[name="message"]').value.trim();
    const lang = document.documentElement.lang === 'en' ? 'en' : 'he';
    const lines = lang === 'en'
      ? [`Hi! I'm reaching out via the website 🐾`, `Name: ${name}`, phone && `Phone: ${phone}`, `Topic: ${topic}`, msg && `Details: ${msg}`]
      : [`היי! הגעתי דרך האתר 🐾`, `שם: ${name}`, phone && `טלפון: ${phone}`, `נושא: ${topic}`, msg && `פירוט: ${msg}`];
    const text = lines.filter(Boolean).join('\n');
    window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('visible'); observer.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Count-up counters (trigger when in view)
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix || '';
  const dur = 1800, start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-US') + (p === 1 ? suffix : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { animateCount(en.target); countObserver.unobserve(en.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num[data-count]').forEach(el => countObserver.observe(el));

// Before/after: reveal "after" on hover (CSS); tap toggles on touch devices
document.querySelectorAll('.ba-item').forEach(item => {
  item.addEventListener('click', () => item.classList.toggle('flip'));
});

// Dog carousels — expose a small API on each element so modal open/close can drive it
document.querySelectorAll('[data-carousel]').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const slides = track ? track.querySelectorAll('img') : [];
  const prev = car.querySelector('[data-carousel-prev]');
  const next = car.querySelector('[data-carousel-next]');
  const dotsWrap = car.querySelector('[data-carousel-dots]');
  let idx = 0, timer = null;
  if (slides.length <= 1) {
    if (prev) prev.hidden = true;
    if (next) next.hidden = true;
  }
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.className = 'on';
      dot.addEventListener('click', () => { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
  }
  function go(n, instant) {
    idx = (n + slides.length) % slides.length;
    if (instant) track.style.transition = 'none';
    track.style.transform = `translateX(${-idx * 100}%)`;
    if (instant) requestAnimationFrame(() => { track.style.transition = ''; });
    if (dotsWrap) dotsWrap.querySelectorAll('span').forEach((d, i) => d.classList.toggle('on', i === idx));
  }
  function start() { if (slides.length > 1 && !timer) timer = setInterval(() => go(idx + 1), 3500); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); } // keep auto-advance alive after a manual move
  if (prev) prev.addEventListener('click', () => { go(idx - 1); restart(); });
  if (next) next.addEventListener('click', () => { go(idx + 1); restart(); });
  // Pause only while the pointer is on the arrows/dots, not the whole image
  [prev, next, dotsWrap].forEach(el => el && el.addEventListener('mouseenter', stop));
  [prev, next, dotsWrap].forEach(el => el && el.addEventListener('mouseleave', restart));
  // API used by the modal open/close handlers
  car._carousel = { reset: () => go(0, true), start, stop };
});

// When a dog modal opens: reset its carousel to slide 1 and (re)start auto-advance.
// When it closes: stop auto-advance so hidden modals don't tick in the background.
document.querySelectorAll('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.openModal);
    if (!dlg) return;
    const car = dlg.querySelector('[data-carousel]');
    if (car && car._carousel) { car._carousel.reset(); car._carousel.start(); }
  });
});
document.querySelectorAll('dialog.dog-modal').forEach(dlg => {
  dlg.addEventListener('close', () => {
    const car = dlg.querySelector('[data-carousel]');
    if (car && car._carousel) car._carousel.stop();
  });
});
