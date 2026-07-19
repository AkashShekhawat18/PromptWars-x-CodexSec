const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'd:\\code\\PromptWars-x-CodexSec\\frontend\\screenshot.png' });
  
  await browser.close();
  console.log("Screenshot saved.");
})();
