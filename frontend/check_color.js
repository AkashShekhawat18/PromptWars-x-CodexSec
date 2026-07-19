const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const linkColor = await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]');
    if (!link) return 'Link not found';
    const textSpan = link.querySelector('span:nth-child(2)');
    if (!textSpan) return 'Span not found';
    return window.getComputedStyle(textSpan).color;
  });

  console.log("Link Text Color:", linkColor);
  await browser.close();
})();
