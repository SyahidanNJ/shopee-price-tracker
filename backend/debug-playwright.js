// Debug script: cek apa yang dilihat Playwright saat buka halaman produk Shopee
const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2] || 'https://shopee.co.id/product/2696878/41308951637';
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'id-ID',
    viewport: { width: 1366, height: 768 }
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();
  // Alur normal seperti manusia: buka homepage dulu untuk dapat session
  await page.goto('https://shopee.co.id', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  console.log('Homepage title:', await page.title());

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(6000);

  console.log('Final URL:', page.url());
  console.log('Title:', await page.title());

  const bodyPreview = await page.evaluate('document.body.innerText.substring(0, 500)');
  console.log('Body preview:\n', bodyPreview);

  const priceEls = await page.evaluate(`(() => {
    const els = document.querySelectorAll('[class*="price"]');
    return Array.from(els).slice(0, 10).map(e => e.className + ' => ' + e.textContent.trim().substring(0, 50));
  })()`);
  console.log('Price candidates:', JSON.stringify(priceEls, null, 2));

  await page.screenshot({ path: 'debug-page.png', fullPage: false });
  console.log('Screenshot saved: debug-page.png');

  await browser.close();
})();
