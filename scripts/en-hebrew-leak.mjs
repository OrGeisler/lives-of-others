// Run like site-check.mjs (copy next to an installed playwright): node en-hebrew-leak.mjs http://localhost:4173
// Every English page: visible Hebrew text (and every Hebrew page: stray English UI words), attributes too.
import { chromium } from 'playwright'
const B = process.argv[2]
const P = ['/', '/dogs', '/dogs/laura', '/about', '/homes', '/volunteer', '/donate', '/contact', '/virtual-adoption', '/virtual-adoption/bobi',
  '/checkout?type=virtual&dog=bobi&tier=50', '/gift-adoption', '/checkout?type=gift&dog=junior', '/birthday', '/birthday-thanks', '/privacy', '/accessibility', '/no-such-page']
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1366, height: 900 } })
for (const path of P) {
  const url = B + '/en' + (path === '/' ? '' : path)
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(1800)
  // open accordions/modals content too
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true))
  const r = await p.evaluate(() => {
    const he = /[֐-׿]/
    const out = new Set()
    const walk = n => { for (const c of n.childNodes) { if (c.nodeType === 3 && he.test(c.textContent)) { const el = c.parentElement; if (el && !el.closest('[lang="he"], script, style, dialog:not([open])')) out.add(c.textContent.trim().slice(0, 70)) } else if (c.nodeType === 1) walk(c) } }
    walk(document.getElementById('root'))
    document.querySelectorAll('#root [aria-label], #root [alt], #root [title], #root [placeholder]').forEach(e => ['aria-label', 'alt', 'title', 'placeholder'].forEach(a => { const v = e.getAttribute(a); if (v && he.test(v) && !e.closest('[lang="he"]')) out.add(`@${a}: ${v.slice(0, 60)}`) }))
    return { dir: document.documentElement.dir, lang: document.documentElement.lang, title: document.title, he: [...out] }
  })
  console.log(`${r.he.length ? '⚠️' : '✓'} /en${path === '/' ? '' : path}  [${r.lang}/${r.dir}] "${r.title.slice(0, 50)}"${r.he.length ? '\n    ' + r.he.slice(0, 12).join('\n    ') : ''}`)
}
await b.close()
