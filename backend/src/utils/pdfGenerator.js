const puppeteer = require('puppeteer');
const { existsSync } = require('fs');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Chromium\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Chromium\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
];

function findBrowser() {
  for (const p of CHROME_PATHS) {
    if (existsSync(p)) return p;
  }
  return null;
}

class PdfGenerator {
  async generate(htmlContent) {
    const executablePath = findBrowser();
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    };
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
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
