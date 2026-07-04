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
document.querySelectorAll('dialog.memorial-modal').forEach(dlg => {
  dlg.querySelectorAll('[data-close-modal]').forEach(b =>
    b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => {
    const r = dlg.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dlg.close();
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
