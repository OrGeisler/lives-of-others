// Postbuild: one static HTML per public route with its own title, description, canonical and a short
// text block inside #root, so search engines and link previews see real content (React replaces it).
// Also writes sitemap.xml. New public route → add it to PAGES below.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://lives-of-others.com'
const OG_IMAGE = `${SITE}/assets/img/hero-two-dogs.jpg`

const PAGES = [
  ['/', 'חיים של אחרים — הצלת כלבים נטושים, טיפול ושיקום', 'עמותת חיים של אחרים — מצילים כלבים מהרחוב ומההסגרים, מטפלים, משקמים ומוצאים להם בית. הכלבים גרים בבתים — לא בכלובים.'],
  ['/dogs', 'הכלבים שלנו — חיים של אחרים', 'הכלבים של עמותת חיים של אחרים שמחכים לבית: הכירו אותם, קראו את הסיפור שלהם ובואו לאמץ.'],
  ['/about', 'על העמותה והצוות — חיים של אחרים', 'עמותה על טהרת ההתנדבות שמחלצת כלבים מהרחוב, מההסגרים וממצבי הזנחה קשים, ונותנת להם אוכל, טיפול רפואי ובית.'],
  ['/homes', 'הבתים הקסומים — פרויקטי הנצחה — חיים של אחרים', 'הבתים הקסומים של חיים של אחרים: בתים לכלבים שהוקמו לזכר יקירים, במקום כלובים.'],
  ['/volunteer', 'התנדבות — חיים של אחרים', 'רוצים להתנדב עם כלבים? הצטרפו למתנדבי עמותת חיים של אחרים.'],
  ['/donate', 'תרומה — חיים של אחרים', 'אנחנו עמותה על טהרת ההתנדבות — קיומנו תלוי אך ורק בתרומות. תרומה מאובטחת בכרטיס אשראי או בביט, עם קבלה למייל.'],
  ['/contact', 'צור קשר — חיים של אחרים', 'צרו קשר עם עמותת חיים של אחרים: אימוץ, התנדבות, תרומה או כל שאלה.'],
  ['/virtual-adoption', 'אימוץ וירטואלי — המלאך השומר שלי — חיים של אחרים', 'לא כל אחד יכול לפתוח את הבית – אבל כל אחד יכול לפתוח את הלב. אמצו וירטואלית כלב בהוראת קבע חודשית והפכו למלאך השומר שלו.'],
  ['/gift-adoption', 'אימוץ במתנה — חיים של אחרים', 'מתנה עם משמעות לאדם שאוהב כלבים: אימוץ וירטואלי של אחד הכלבים שהצלנו, בתרומה חד פעמית של 180 ₪.'],
  ['/birthday', 'יום הולדת לכלב 🎂 — חיים של אחרים', 'כל חודש כלב אחר מבית המחסה חוגג יום הולדת — וזו ההזדמנות שלכם לפנק אותו במתנה קטנה שתעשה לו את היום.'],
  ['/privacy', 'מדיניות פרטיות ותקנון — חיים של אחרים', 'מדיניות הפרטיות והתקנון של אתר עמותת חיים של אחרים.'],
  ['/accessibility', 'הצהרת נגישות — חיים של אחרים', 'הצהרת הנגישות של אתר עמותת חיים של אחרים: מה הונגש, מגבלות ידועות ולמי לפנות.'],
  ['/en/accessibility', 'Accessibility statement — Lives of Others', 'Accessibility statement of the Lives of Others website: what we did, known limitations and who to contact.'],
  ['/en', 'Lives of Others — Rescuing, Rehabilitating & Rehoming Abandoned Dogs in Israel', 'Lives of Others is an Israeli volunteer-run nonprofit that rescues abandoned dogs, treats and rehabilitates them, and finds them homes.'],
]

const NAV = [['/', 'דף הבית'], ['/dogs', 'הכלבים שלנו'], ['/virtual-adoption', 'אימוץ וירטואלי'], ['/gift-adoption', 'אימוץ במתנה'], ['/birthday', 'יום הולדת לכלב'], ['/donate', 'תרומה'], ['/about', 'על העמותה'], ['/contact', 'צור קשר']]

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clip = (s, n = 160) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).replace(/\s\S*$/, '') + '…' : t }
const abs = u => (!u ? OG_IMAGE : u.startsWith('http') ? u : SITE + (u.startsWith('/') ? u : '/' + u))

// Facts for search engines and AI answers. Every line is taken from the site's own copy (About, footer,
// Contact, Donate, Volunteer); keep in sync with public/llms.txt.
const ORG = {
  '@context': 'https://schema.org', '@type': 'NGO', '@id': `${SITE}/#org`,
  name: 'עמותת חיים של אחרים', alternateName: ['חיים של אחרים', 'Lives of Others', 'Lives of Others Rescue'],
  url: SITE, logo: `${SITE}/assets/img/logo.jpg`, image: OG_IMAGE, description: PAGES[0][2],
  foundingDate: '2016', founder: [{ '@type': 'Person', name: 'טלי עבאדי' }, { '@type': 'Person', name: 'דבורה אטיה' }],
  identifier: { '@type': 'PropertyValue', propertyID: 'מספר עמותה (ע"ר)', value: '580754083' },
  nonprofitStatus: 'Nonprofit', areaServed: { '@type': 'Country', name: 'Israel' },
  address: { '@type': 'PostalAddress', addressLocality: 'רמת אפעל', addressCountry: 'IL' },
  telephone: '+972-52-829-6622',
  knowsAbout: ['הצלת כלבים', 'אימוץ כלבים', 'שיקום כלבים', 'אימוץ וירטואלי', 'dog rescue', 'dog adoption in Israel'],
  sameAs: ['https://www.facebook.com/lifeofothers', 'https://www.instagram.com/lives.of.others.rescue'],
}

const FAQ = [
  ['מה זו עמותת חיים של אחרים?', 'עמותה רשומה (ע"ר 580754083) ללא מטרת רווח, הפועלת על טהרת ההתנדבות. נוסדה בשנת 2016 על ידי טלי עבאדי ודבורה אטיה, ומצילה כלבים מהרחוב ומההסגרים ברחבי הארץ, מטפלת בהם, משקמת אותם ומוצאת להם בית.'],
  ['במה העמותה שונה מבית מחסה רגיל?', 'במקום כלובים — בתים. הכלבים גרים ב"בתים הקסומים", פרויקט הנצחה לזכר סמ"ר עדי צור, רס"ם במילואים יאיר כץ ושני גבאי, שנפלו ונרצחו במלחמת ה־7 באוקטובר. העמותה לעולם אינה ממיתה כלבים: כל כלב נשאר בחסותה עד שיאומץ או עד שיגיע לשיבה טובה.'],
  ['איפה העמותה נמצאת?', 'בית המחסה נמצא ברמת אפעל (בוויז: "הבית הקסום ע"ש עדי צור"). העמותה פועלת ברמת אפעל ובקרית גת. ביקור בתיאום מראש.'],
  ['איך מאמצים כלב?', 'בוחרים כלב בעמוד "הכלבים שלנו" באתר ופונים בוואטסאפ לברי: 052-8296622. לפני אימוץ עורכים שיחת היכרות ושאלון התאמה, כדי שכל כלב יגיע לבית הנכון בשבילו.'],
  ['מה זה אימוץ וירטואלי?', 'מי שלא יכול לאמץ בבית יכול להיות "המלאך השומר" של כלב: בוחרים כלב מסוים ומלווים אותו בחסות חודשית קבועה של 25, 50 או 100 ₪ עד שימצא בית. מקבלים תעודת אימוץ אישית, עדכון חודשי עם תמונות וסרטונים, ואפשר לבוא לבקר אותו בתיאום מראש. יש גם אימוץ וירטואלי במתנה, בתרומה חד פעמית של 180 ₪.'],
  ['איך תורמים לעמותה?', 'בכרטיס אשראי (חד פעמי או הוראת קבע) בעמוד התרומה באתר, בביט ל־052-8296622, בפייבוקס ל־054-6881116, בהעברה בנקאית (מזרחי טפחות 20, סניף 539, חשבון 497218, למוטב "חיים של אחרים") או מחו"ל ב־PayPal. העמותה תלויה אך ורק בתרומות.'],
  ['איך מתנדבים?', 'מתנדבים בבית המחסה ברמת אפעל בכל ימות השבוע בתיאום מראש, מגיל 16 ומעלה, ויוצאים לטייל עם הכלבים. בשבתות יש טיולים משפחתיים להורים וילדים. אפשר לעזור גם בשיווק, גיוס תרומות ושיפוץ הבתים. נרשמים בעמוד ההתנדבות באתר.'],
]
const FAQ_LD = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}
const EN_HTML = `<section><h2>About Lives of Others</h2><p>Lives of Others (Hebrew: חיים של אחרים) is a registered Israeli nonprofit (amuta no. 580754083), volunteer-run, founded in 2016 by Tali Abadi and Dvora Atia. It rescues abandoned dogs from the streets and municipal pounds across Israel, treats and rehabilitates them, and finds them homes. Instead of cages, the dogs live in "Magical Homes", a memorial project for Adi Tzur, Yair Katz and Shani Gabay, who fell and were murdered in the October 7 war. The nonprofit never puts a dog down. Shelter: Ramat Efal, Israel. Contact (WhatsApp): +972-52-829-6622. Donations from abroad: PayPal (paypal.me/savingthedogs).</p></section>`
const FAQ_HTML = `<section><h2>שאלות נפוצות</h2>${FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`

try { process.loadEnvFile('.env.local') } catch { /* Vercel provides env directly */ }

async function fetchDogs() {
  const url = process.env.VITE_SUPABASE_URL, key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) { console.warn('prerender: no Supabase env, skipping dog pages'); return [] }
  try {
    const r = await fetch(`${url}/rest/v1/dogs?select=slug,name,story,main_image,available_for_virtual&active=eq.true&order=sort`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.json()
  } catch (e) { console.warn('prerender: dog fetch failed, skipping dog pages:', e.message); return [] }
}

// Re-runs start from the pristine copy (vite build empties dist/ each time)
const template = readFileSync(existsSync('dist/spa.html') ? 'dist/spa.html' : 'dist/index.html', 'utf8')
// SPA fallback for routes without their own page (vercel.json rewrites here), so they don't inherit the home canonical
writeFileSync('dist/spa.html', template)

function render(path, title, desc, image, h1, body, extra = '') {
  const url = SITE + path
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    path === '/' || path === '/about' ? `<script type="application/ld+json">${JSON.stringify(ORG)}</script>` : '',
    path === '/' || path === '/about' ? `<script type="application/ld+json">${JSON.stringify(FAQ_LD)}</script>` : '',
  ].filter(Boolean).join('\n    ')
  const links = NAV.filter(([p]) => p !== path).map(([p, t]) => `<a href="${p}">${t}</a>`).join(' · ')
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta (name="description"|property="og:(title|description|image)")[^>]*>/g, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><main><h1>${esc(h1)}</h1><p>${esc(body)}</p>${extra}<nav>${links}</nav></main></div>`)
  if (path.startsWith('/en')) html = html.replace('<html lang="he" dir="rtl">', '<html lang="en" dir="ltr">')
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true })
  writeFileSync(file, html)
  return url
}

const urls = []
// Root last: the other pages are built from the untouched dist/index.html
for (const [path, title, desc] of PAGES.slice(1)) urls.push(render(path, title, desc, OG_IMAGE, title.split(' — ')[0], desc, path === '/about' ? FAQ_HTML : path === '/en' ? EN_HTML : ''))
for (const d of await fetchDogs()) {
  const story = clip(d.story) || `${d.name} מחכה לבית בעמותת חיים של אחרים.`
  urls.push(render(`/dogs/${d.slug}`, `${d.name} — חיים של אחרים`, story, abs(d.main_image), d.name, story))
  if (d.available_for_virtual)
    urls.push(render(`/virtual-adoption/${d.slug}`, `לאמץ וירטואלית את ${d.name} — חיים של אחרים`, clip(`הפכו למלאך השומר של ${d.name}: אימוץ וירטואלי בהוראת קבע חודשית. ${d.story ?? ''}`), abs(d.main_image), `המלאך השומר של ${d.name}`, story))
}
const [, t0, d0] = PAGES[0]
urls.unshift(render('/', t0, d0, OG_IMAGE, 'חיים של אחרים — עמותה להצלה, טיפול ושיקום כלבים נטושים', 'אנחנו מחלצים כלבים מהרחוב, מההסגרים וממצבי הזנחה קשים — נותנים להם אוכל, טיפול רפואי, בית, ומעל הכול: את ההרגשה שהם אהובים.', FAQ_HTML))

writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`)
console.log(`prerender: ${urls.length} pages + sitemap.xml`)
