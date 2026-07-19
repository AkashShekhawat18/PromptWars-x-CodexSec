const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1920, height: 1080 } });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const rect = await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]');
    if (!link) return null;
    const { x, y, width, height } = link.getBoundingClientRect();
    const style = window.getComputedStyle(link);
    return { x, y, width, height, visibility: style.visibility, opacity: style.opacity, zIndex: style.zIndex };
  });

  console.log("Desktop Link Bounds:", JSON.stringify(rect, null, 2));
  await browser.close();
})();
