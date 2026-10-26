// Run: copy next to an installed playwright (e.g. ~/.cache/pw; `npx -p` doesn't resolve ESM imports), then
//   node site-check.mjs [base-url] [screenshot-dir]      (~6 min; Android/desktop use the installed Google Chrome)
// Full site check: every page on iPhone (WebKit), Android (Chrome) and desktop (Chrome):
// white screen, sideways scroll, JS errors, broken own images, failed own-host requests, every internal link,
// plus flows (menu, dog → back keeps position, checkout filled to the Grow redirect, contact form) with writes stubbed.
import { chromium, webkit, devices } from 'playwright'
import { mkdirSync } from 'node:fs'
const BASE = process.argv[2] || 'https://lives-of-others.com', OUT = process.argv[3] || 'site-shots'
const HOST = new URL(BASE).host
mkdirSync(OUT, { recursive: true })
const HE_PAGES = ['/', '/dogs', '/dogs/laura', '/about', '/homes', '/volunteer', '/donate', '/contact', '/virtual-adoption', '/virtual-adoption/bobi',
  '/checkout?type=virtual&dog=bobi&tier=50', '/gift-adoption', '/checkout?type=gift&dog=junior', '/birthday', '/privacy', '/accessibility',
  '/no-such-page']
const PAGES = [...HE_PAGES, ...HE_PAGES.map(p => '/en' + (p === '/' ? '' : p))]
const DEVS = [['iphone', webkit, devices['iPhone 13'], {}], ['android', chromium, devices['Pixel 7'], { channel: 'chrome' }],
  ['desktop', chromium, { viewport: { width: 1440, height: 900 } }, { channel: 'chrome' }]]
// devices run in parallel; each device's lines are printed together when it finishes
const links = new Set()
const runDevice = async ([name, engine, dev, opts]) => {
  const out = []; const log = (...a) => out.push(a.join(' '))
const stub = async ctx => {
  // never write to production: stub the checkout function, contact API, Supabase inserts, Grow
  await ctx.route(/functions\/v1\/checkout/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ redirect: 'https://pay.grow.link/STUB' }) }))
  await ctx.route(/\/api\/contact/, r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }))
  await ctx.route(/\/rest\/v1\/.*/, r => r.request().method() === 'GET' ? r.continue() : r.fulfill({ status: 201, body: '[]', contentType: 'application/json' }))
  await ctx.route(/pay\.grow\.link\/STUB/, r => r.fulfill({ status: 200, contentType: 'text/html', body: '<h1>GROW STUB</h1>' }))
}
  const b = await engine.launch(opts); const ctx = await b.newContext({ ...dev, locale: 'he-IL' }); await stub(ctx)
  await ctx.addInitScript(() => { try { sessionStorage.setItem('wa-hidden', '1') } catch {} })   // the floating WhatsApp button covers clicks
  log(`\n== ${name}`)
  for (const path of PAGES) {
    const p = await ctx.newPage(); const errs = [], failed = []
    p.on('pageerror', e => errs.push('JS: ' + e.message))
    p.on('response', r => { const u = new URL(r.url()); if (u.host === HOST && r.status() >= 400 && !path.includes('no-such')) failed.push(r.status() + ' ' + u.pathname) })
    p.on('requestfailed', r => { const u = new URL(r.url()); if (u.host === HOST && !/\.mp4/.test(u.pathname)) failed.push('FAIL ' + u.pathname) })
    await p.goto(BASE + path, { waitUntil: 'load', timeout: 45000 }).catch(e => errs.push(e.message))
    await p.waitForTimeout(2200)
    // scroll through so lazy images load
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)) } scrollTo(0, 0) })
    await p.waitForTimeout(800)
    const r = await p.evaluate(() => ({
      text: document.getElementById('root')?.innerText.trim().length ?? 0,
      over: document.documentElement.scrollWidth - innerWidth,
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map(i => i.src.replace(location.origin, '')),
      links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/') && !h.startsWith('//')),
      dead: [...document.querySelectorAll('a[href]')].filter(a => ['', '#'].includes(a.getAttribute('href'))).map(a => a.innerText.trim().slice(0, 30)),
    }))
    r.links.forEach(l => links.add(l.split('#')[0] || '/'))
    const issues = [r.text < 200 && 'EMPTY', r.over > 1 && `sideways ${r.over}px`, ...errs, ...[...new Set(failed)], ...r.broken.map(s => 'broken img ' + s), ...r.dead.map(t => 'dead link "' + t + '"')].filter(Boolean)
    log(`${issues.length ? '⚠️' : '✓'} ${path}${issues.length ? ' — ' + issues.join(' | ').slice(0, 400) : ''}`)
    await p.screenshot({ path: `${OUT}/${name}${path.replace(/[/?&=]/g, '_')}.png`, fullPage: name !== 'desktop' ? false : false })
    await p.close()
  }
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  const step = async (label, fn) => { try { const res = await fn(); log(`  ${res === false ? '⚠️' : '✓'} flow: ${label}${typeof res === 'string' ? ' — ' + res : ''}`) } catch (e) { log(`  ⚠️ flow: ${label} — ${e.message.split('\n')[0].slice(0, 160)}`) } }
  // menu: every nav item navigates
  for (const home of ['/', '/en']) await step(`menu items navigate (${home})`, async () => {
    await p.goto(BASE + home, { waitUntil: 'load' }); await p.waitForTimeout(1500)
    const phone = name !== 'desktop'
    const open = async () => { if (phone) { await p.locator('.nav-toggle').click(); await p.waitForTimeout(400) } }
    await open(); const items = await p.locator('.main-nav a:not(.nav-lang)').evaluateAll(as => as.map(a => [a.textContent.trim(), a.getAttribute('href')]))
    const bad = []
    for (const [t, h] of items) {
      await p.goto(BASE + home, { waitUntil: 'load' }); await p.waitForTimeout(800); await open()
      await p.locator(`.main-nav a[href="${h}"]`).first().click(); await p.waitForTimeout(1200)
      const ok = await p.evaluate(h => location.pathname === h.split('#')[0], h)
      if (!ok) bad.push(t)
    }
    return bad.length ? 'not navigating: ' + bad.join(', ') : `${items.length} items OK`
  })
  await step('dog → back returns to same spot in gallery', async () => {
    await p.goto(BASE + '/dogs', { waitUntil: 'load' }); await p.waitForTimeout(1800)
    const cards = p.locator('.dog-card'); const n = await cards.count(); const c = cards.nth(Math.min(7, n - 1))
    await c.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); const y0 = await p.evaluate(() => scrollY)
    await c.click(); await p.waitForTimeout(1500)
    const back = p.locator('.dog-page-back').first()
    if (await back.count()) await back.click(); else await p.goBack()
    await p.waitForTimeout(1800); const y1 = await p.evaluate(() => scrollY)
    return Math.abs(y1 - y0) < 300 ? `y ${y0} → ${y1}` : `jumped: y ${y0} → ${y1}`
  })
  for (const [label, url] of [['virtual checkout', '/checkout?type=virtual&dog=bobi&tier=50'], ['gift checkout', '/checkout?type=gift&dog=junior'], ['EN virtual checkout', '/en/checkout?type=virtual&dog=bobi&tier=50'], ['EN gift checkout', '/en/checkout?type=gift&dog=junior']]) {
    await step(label + ' filled → Grow redirect (stubbed)', async () => {
      await p.goto(BASE + url, { waitUntil: 'load' }); await p.waitForTimeout(1800)
      const form = p.locator('form.co-form')
      const ins = form.locator('input:visible, textarea:visible, select:visible')
      for (let i = 0; i < await ins.count(); i++) {
        const e = ins.nth(i); const tag = await e.evaluate(x => x.tagName); const type = await e.getAttribute('type')
        if (tag === 'SELECT') { await e.selectOption({ index: 1 }); continue }
        if (type === 'checkbox') { if (await e.getAttribute('required') !== null) await e.check(); continue }
        if (type === 'date' || (await e.inputValue())) continue
        await e.fill(type === 'tel' ? '0501234567' : type === 'email' ? 'test@example.com' : tag === 'TEXTAREA' ? 'בדיקה' : 'בדיקה אוטומטית')
      }
      await p.locator('.co-submit').click(); await p.waitForTimeout(3500)
      const at = p.url(); const msg = await p.locator('.form-error, .co-error, [role="alert"]').allInnerTexts().catch(() => [])
      return at.includes('STUB') ? 'reached Grow' : `stayed on ${at.replace(BASE, '')} ${msg.join(' ').slice(0, 120)}`
    })
  }
  await step('contact form submit (stubbed)', async () => {
    await p.goto(BASE + '/contact', { waitUntil: 'load' }); await p.waitForTimeout(1500)
    const f = p.locator('form').first()
    for (const [s, v] of [['input[type="text"], input[name="name"]', 'בדיקה'], ['input[type="tel"]', '0501234567'], ['input[type="email"]', 'test@example.com'], ['textarea', 'בדיקה אוטומטית']]) { const e = f.locator(s).first(); if (await e.count()) await e.fill(v) }
    const pages0 = ctx.pages().length
    await f.locator('button[type="submit"]').click(); await p.waitForTimeout(2500)
    const txt = await p.locator('main, #root').first().innerText()
    for (const extra of ctx.pages().slice(pages0)) await extra.close()   // wa.me tab, never sent
    return /נשמרה אצלנו|We received your message/.test(txt) ? 'confirmation shown' : false
  })
  await step('EN contact form submit (stubbed)', async () => {
    await p.goto(BASE + '/en/contact', { waitUntil: 'load' }); await p.waitForTimeout(1500)
    const f = p.locator('form').first()
    for (const [sel, v] of [['input[name="name"]', 'Test'], ['input[type="tel"]', '0501234567'], ['textarea', 'automatic test']]) await f.locator(sel).first().fill(v)
    const n0 = ctx.pages().length; await f.locator('button[type="submit"]').click(); await p.waitForTimeout(2500)
    for (const extra of ctx.pages().slice(n0)) await extra.close()
    return /We received your message/.test(await p.locator('#root').innerText()) ? 'confirmation shown' : false
  })
  await step('language switch keeps the page', async () => {
    await p.goto(BASE + '/donate', { waitUntil: 'load' }); await p.waitForTimeout(1000)
    if (name !== 'desktop') { await p.locator('.nav-toggle').click(); await p.waitForTimeout(400); await p.locator('.nav-lang').click() } else await p.locator('.lang-switch').click()
    await p.waitForTimeout(1200); const a = new URL(p.url()).pathname
    if (name !== 'desktop') { await p.locator('.nav-toggle').click(); await p.waitForTimeout(400); await p.locator('.nav-lang').click() } else await p.locator('.lang-switch').click()
    await p.waitForTimeout(1200); const c = new URL(p.url()).pathname
    return a === '/en/donate' && c === '/donate' ? '/donate → /en/donate → /donate' : `got ${a} then ${c}`
  })
  await step('accessibility menu opens', async () => {
    await p.goto(BASE + '/', { waitUntil: 'load' }); await p.waitForTimeout(1200)
    await p.locator('.a11y-btn, [aria-label*="נגישות"]').first().click(); await p.waitForTimeout(500)
    return (await p.locator('.a11y-panel, [role="dialog"]').first().isVisible()) ? 'panel visible' : false
  })
  if (errs.length) log('  JS errors during flows: ' + errs.slice(0, 3).join(' | '))
  await b.close()
  console.log(out.join('\n'))
}
await Promise.all(DEVS.map(runDevice))
const log = (...a) => console.log(a.join(' '))
// every internal link seen anywhere renders
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage(); const dead = []
for (const l of [...links].sort()) { if (/^\/(admin|certificate|no-such-page|en\/no-such-page)/.test(l)) continue; const r = await p.goto(BASE + l, { waitUntil: 'load' }).catch(() => null); await p.waitForTimeout(900)
  const t = await p.evaluate(() => document.getElementById('root')?.innerText || ''); if (!r || r.status() >= 400 || t.length < 200 || /לא נמצא|404/.test(t.slice(0, 300))) dead.push(l) }
log(`\n== internal links: ${links.size} checked, broken: ${dead.length ? dead.join(', ') : 'none'}`)
await b.close()
