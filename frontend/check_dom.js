const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const elements = await page.evaluate(() => {
    const link = document.querySelector('a[href="/"]');
    const bounds = link ? link.getBoundingClientRect() : null;
    const body = document.body.getBoundingClientRect();
    const isLinkVisible = link ? window.getComputedStyle(link).opacity : null;
    return { 
      linkBounds: bounds, 
      bodyBounds: body,
      opacity: isLinkVisible,
      html: link ? link.outerHTML : null
    };
  });

  console.log(JSON.stringify(elements, null, 2));
  await browser.close();
})();
