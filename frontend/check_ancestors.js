const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1920, height: 1080 } });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle0' });
  
  const ancestorStyles = await page.evaluate(() => {
    let el = document.querySelector('a[href="/"]');
    const styles = [];
    while (el && el !== document) {
      const style = window.getComputedStyle(el);
      styles.push({
        tag: el.tagName,
        className: el.className,
        opacity: style.opacity,
        visibility: style.visibility,
        display: style.display,
        clip: style.clipPath,
        color: style.color
      });
      el = el.parentNode;
    }
    return styles;
  });

  console.log(JSON.stringify(ancestorStyles, null, 2));
  await browser.close();
})();
