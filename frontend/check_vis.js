const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const visibility = await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]');
    if (!link) return null;
    const style = window.getComputedStyle(link);
    return {
      visibility: style.visibility,
      display: style.display,
      zIndex: style.zIndex
    };
  });

  console.log("Link Visibility:", JSON.stringify(visibility, null, 2));
  await browser.close();
})();
