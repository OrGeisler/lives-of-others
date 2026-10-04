// Local check of the PDF renderer against the local preview server: node scripts/pdf-test.mjs <id> <out.pdf>
import fs from 'node:fs'
import puppeteer from 'puppeteer-core'
const [id, out] = process.argv.slice(2)
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const p = await b.newPage()
await p.goto(`http://localhost:4173/certificate/${id}?pdf=1`, { waitUntil: 'networkidle0' })
await p.waitForSelector('body[data-cert-ready="1"]', { timeout: 15000 })
fs.writeFileSync(out, await p.pdf({ format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true }))
await b.close(); console.log('ok', out)
