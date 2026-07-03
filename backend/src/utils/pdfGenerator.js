const puppeteer = require('puppeteer');
const { existsSync } = require('fs');
const logger = require('./logger');

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Chromium\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ...(process.env.LOCALAPPDATA ? [
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Chromium\\Application\\chrome.exe`,
    `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ] : []),
];

function findBrowser() {
  for (const p of CHROME_PATHS) {
    try {
      if (existsSync(p)) return p;
    } catch {
      continue;
    }
  }
  return null;
}

class PdfGenerator {
  constructor() {
    this.browser = null;
    this.browserRefCount = 0;
    this.idleTimer = null;
  }

  async generate(htmlContent) {
    const browser = await this.getBrowser();
    let page;
    try {
      page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      });
      return pdfBuffer;
    } catch (err) {
      logger.error('PDF generation failed', { message: err.message });
      throw err;
    } finally {
      if (page) await page.close().catch(() => {});
      this.releaseBrowser();
    }
  }

  async getBrowser() {
    if (this.browser && this.browser.isConnected()) {
      this.browserRefCount += 1;
      clearTimeout(this.idleTimer);
      return this.browser;
    }

    const executablePath = findBrowser();
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    };
    if (executablePath) {
      launchOptions.executablePath = executablePath;
      logger.debug(`Using browser at: ${executablePath}`);
    }

    this.browser = await puppeteer.launch(launchOptions);
    this.browserRefCount = 1;
    logger.debug('Browser instance created');
    return this.browser;
  }

  releaseBrowser() {
    this.browserRefCount -= 1;
    if (this.browserRefCount <= 0 && this.browser) {
      this.idleTimer = setTimeout(() => {
        this.closeBrowser();
      }, 30000);
    }
  }

  async closeBrowser() {
    if (this.browser) {
      try {
        await this.browser.close();
        logger.debug('Browser instance closed');
      } catch (err) {
        logger.error('Error closing browser', { message: err.message });
      }
      this.browser = null;
      this.browserRefCount = 0;
    }
  }

  async shutdown() {
    clearTimeout(this.idleTimer);
    await this.closeBrowser();
  }
}

module.exports = new PdfGenerator();
