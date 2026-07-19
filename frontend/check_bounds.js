const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const rect = await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]');
    if (!link) return null;
    const { x, y, width, height } = link.getBoundingClientRect();
    return { x, y, width, height };
  });

  console.log("Link Bounds:", JSON.stringify(rect, null, 2));
  await browser.close();
})();
