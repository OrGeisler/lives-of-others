// Phone check of every public page as an iPhone (WebKit = Safari's engine) and an Android phone.
// Flags: empty page (white screen), sideways scroll, JS errors. Screenshots → ./mobile-shots/
// Run:  npx -y -p playwright@1 node scripts/mobile-check.mjs [base-url]
//       (first time: npx -y playwright@1 install webkit; Android uses the installed Google Chrome)
import { chromium, devices, webkit } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'https://lives-of-others.com'
const PAGES = ['/', '/about', '/dogs', '/dogs/laura', '/virtual-adoption', '/virtual-adoption/bobi', '/checkout?type=virtual&dog=bobi&tier=50',
  '/gift-adoption', '/checkout?type=gift&dog=junior', '/birthday', '/volunteer', '/donate', '/contact', '/privacy', '/en']
mkdirSync('mobile-shots', { recursive: true })
let bad = 0
for (const [name, engine, dev, opts] of [['iphone', webkit, devices['iPhone 13'], {}], ['android', chromium, devices['Pixel 7'], { channel: 'chrome' }]]) {
  const b = await engine.launch(opts)
  const ctx = await b.newContext({ ...dev, locale: 'he-IL' })
  console.log(`== ${name}`)
  for (const path of PAGES) {
    const p = await ctx.newPage(); const errs = []
    p.on('pageerror', e => errs.push(e.message))
    // 'load' not 'networkidle': embedded videos keep the network busy
    await p.goto(BASE + path, { waitUntil: 'load', timeout: 45000 }).catch(e => errs.push(e.message))
    await p.waitForTimeout(2500)
    const r = await p.evaluate(() => ({ text: document.getElementById('root')?.innerText.trim().length ?? 0, over: document.documentElement.scrollWidth - window.innerWidth }))
    const issues = [r.text < 200 && 'EMPTY PAGE', r.over > 1 && `sideways scroll ${r.over}px`, ...errs].filter(Boolean)
    if (issues.length) bad++
    console.log(`${issues.length ? '⚠️' : '✓'} ${path}${issues.length ? ' — ' + issues.join(' | ').slice(0, 200) : ''}`)
    await p.screenshot({ path: `mobile-shots/${name}${path.replace(/[/?&=]/g, '_')}.png` })
    await p.close()
  }
  await b.close()
}
process.exit(bad ? 1 : 0)
