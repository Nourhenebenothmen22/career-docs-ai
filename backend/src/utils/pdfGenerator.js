const puppeteer = require('puppeteer');

class PdfGenerator {
  async generate(htmlContent) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      });
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}

module.exports = new PdfGenerator();
