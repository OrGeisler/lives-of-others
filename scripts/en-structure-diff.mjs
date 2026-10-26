// Run like site-check.mjs (copy next to an installed playwright): node en-structure-diff.mjs http://localhost:4173
// Hebrew vs English twin pages: same headings count, buttons, links (same targets), images, form fields.
import { chromium } from 'playwright'
const B = process.argv[2]
const P = ['/', '/dogs', '/dogs/laura', '/about', '/homes', '/volunteer', '/donate', '/contact', '/virtual-adoption', '/virtual-adoption/bobi',
  '/checkout?type=virtual&dog=bobi&tier=50', '/gift-adoption', '/checkout?type=gift&dog=junior', '/birthday', '/privacy', '/accessibility']
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 900 } })
const grab = async url => {
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1800)
  return p.evaluate(() => {
    const r = document.getElementById('root'); const q = s => [...r.querySelectorAll(s)]
    const norm = h => (h || '').replace(/^\/en(?=\/|$)/, '') || '/'
    return {
      h: q('h1,h2,h3').length, btn: q('button').length, img: q('img').length, field: q('input,select,textarea').length,
      links: q('a[href]').map(a => { const h = a.getAttribute('href'); return h.startsWith('/') ? norm(h.split('?')[0]) : h.replace(/\?text=.*/, '?text') }).sort(),
    }
  })
}
for (const path of P) {
  const he = await grab(B + path), en = await grab(B + '/en' + (path === '/' ? '' : path))
  const d = []
  for (const k of ['h', 'btn', 'img', 'field']) if (he[k] !== en[k]) d.push(`${k} he=${he[k]} en=${en[k]}`)
  const onlyHe = he.links.filter(l => !en.links.includes(l)), onlyEn = en.links.filter(l => !he.links.includes(l))
  if (onlyHe.length) d.push('links only HE: ' + [...new Set(onlyHe)].join(', '))
  if (onlyEn.length) d.push('links only EN: ' + [...new Set(onlyEn)].join(', '))
  console.log(`${d.length ? '⚠️' : '✓'} ${path}${d.length ? '\n    ' + d.join('\n    ') : ''}`)
}
await b.close()
