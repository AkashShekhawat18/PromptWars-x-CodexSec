const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]: ${error.message}`);
  });

  try {
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
    const content = await page.content();
    console.log("HTML length:", content.length);
  } catch (err) {
    console.log("Navigation error:", err.message);
  }

  await browser.close();
})();
