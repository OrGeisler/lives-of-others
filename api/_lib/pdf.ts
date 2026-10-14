import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

// Renders the /certificate/:id page to an A4-landscape PDF with a real browser (perfect Hebrew/RTL).
// On Vercel it uses the serverless Chromium build; locally it uses the installed Google Chrome.
// format 'jpg': the certificate as an image (shows inline in WhatsApp, unlike a PDF)
export async function certificatePdf(siteUrl: string, id: string, format: 'pdf' | 'jpg' = 'pdf'): Promise<Buffer> {
  const local = !process.env.VERCEL
  const browser = await puppeteer.launch(local
    ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true }
    : { args: chromium.args, executablePath: await chromium.executablePath(), headless: true })
  try {
    const page = await browser.newPage()
    if (format === 'jpg') await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1.5 })
    await page.goto(`${siteUrl}/certificate/${id}?pdf=1`, { waitUntil: 'networkidle0', timeout: 25000 })
    await page.waitForSelector('body[data-cert-ready="1"]', { timeout: 15000 })
    if (format === 'jpg') {
      const el = await page.$('.cert')
      return Buffer.from(await (el ?? page).screenshot({ type: 'jpeg', quality: 88 }))
    }
    const pdf = await page.pdf({ format: 'A4', landscape: true, printBackground: true, preferCSSPageSize: true })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
