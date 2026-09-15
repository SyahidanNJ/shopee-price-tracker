import pino from 'pino';
import { config } from '../../config';
import { ProductData } from './shopeeParser';

const logger = pino();

// Lazy loader: modul hanya di-resolve saat fallback dipakai,
// agar server tetap jalan meski playwright belum ter-install.
let chromiumLoader: any = null;
function loadChromium() {
  if (!chromiumLoader) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    chromiumLoader = require('playwright').chromium;
  }
  return chromiumLoader;
}

export const playwrightFallback = {
  available(): boolean {
    try {
      loadChromium();
      return true;
    } catch {
      logger.warn('Playwright not installed, fallback disabled');
      return false;
    }
  },

  async fetch(url: string): Promise<ProductData | null> {
    if (!this.available()) {
      return null;
    }

    const chromium = loadChromium();
    let browser: any;

    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-blink-features=AutomationControlled']
      });

      const context = await browser.newContext({
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        locale: 'id-ID',
        viewport: { width: 1366, height: 768 }
      });

      const page = await context.newPage();

      await page.goto(url, {
        timeout: config.priceCheckTimeoutMs * 2,
        waitUntil: 'domcontentloaded'
      });

      // Tunggu element harga dirender oleh JavaScript (maks 10 detik)
      await page
        .waitForSelector('[class*="price"], [data-sqe="price"]', { timeout: 10000 })
        .catch(() => null);

      // body evaluasi dikirim sebagai string agar tidak tersentuh
      // transpile esbuild/tsx (menghindari error __name is not defined)
      const extractFn = `(() => {
        const toNumber = function(s) {
          if (!s) return null;
          const cleaned = String(s).replace(/[^0-9]/g, '');
          return cleaned ? parseInt(cleaned, 10) : null;
        };
        const pickText = function(selectors) {
          for (const sel of selectors) {
            const el = document.querySelector(sel);
            const t = el && el.textContent ? el.textContent.trim() : '';
            if (t) return t;
          }
          return null;
        };
        const name = pickText(['[data-sqe="name"]', 'h1', '[class*="title"]']) ||
          (document.querySelector('meta[property="og:title"]') || {}).content || '';
        const priceText = pickText([
          '[class*="price-item--price"]',
          '[data-sqe="price"]',
          '[class*="price"]'
        ]);
        const oldPriceText = pickText([
          '[class*="price-original"]',
          '[class*="strikethrough"]'
        ]);
        const imgEl = document.querySelector('meta[property="og:image"]');
        const imageUrl = imgEl ? imgEl.getAttribute('content') : null;
        const bodyText = document.body ? document.body.innerText : '';
        let stockStatus = null;
        if (/habis|sold|out of stock|tidak tersedia/i.test(bodyText)) {
          stockStatus = 'out_of_stock';
        } else if (/stok|tersedia|stock/i.test(bodyText)) {
          stockStatus = 'available';
        }
        return {
          name: name,
          price: toNumber(priceText),
          originalPrice: toNumber(oldPriceText),
          discountPrice: null,
          imageUrl: imageUrl,
          stockStatus: stockStatus
        };
      })()`;

      const data: ProductData = await page.evaluate(extractFn);
      data.pageUrl = page.url();
      data.title = await page.title();

      await browser.close();

      // Deteksi blokir/anti-bot Shopee (redirect ke halaman verify / minta login).
      // PRD: jangan bypass mekanisme keamanan, cukup tandai & log dengan jelas.
      if (data.pageUrl?.includes('/verify/')) {
        logger.warn({ pageUrl: data.pageUrl }, 'Shopee anti-bot login wall detected (verify/traffic)');
        return { ...data, price: null, blocked: true };
      }
      if (/Masuk Diperlukan|login required|belum masuk/i.test((data as any).title || '')) {
        logger.warn('Login required detected on page');
        return { ...data, price: null, blocked: true };
      }

      logger.info({ price: data.price, name: data.name?.substring(0, 50) }, 'Playwright fallback result');
      return data;

    } catch (error: any) {
      logger.error({ message: error.message }, 'Playwright fallback failed');
      if (browser) {
        await browser.close().catch(() => null);
      }
      return null;
    }
  }
};
