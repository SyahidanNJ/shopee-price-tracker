import * as cheerio from 'cheerio';

export interface ProductData {
  name: string;
  price: number | null;
  originalPrice: number | null;
  discountPrice: number | null;
  imageUrl: string | null;
  stockStatus: string | null;
  pageUrl?: string;
  title?: string;
  blocked?: boolean;
}

export interface ShopeeParser {
  parse(html: string): ProductData;
}

const PRICE_SCALE = 100000;

export class CheerioParser implements ShopeeParser {
  parse(html: string): ProductData {
    const data: ProductData = {
      name: '',
      price: null,
      originalPrice: null,
      discountPrice: null,
      imageUrl: null,
      stockStatus: null
    };

    this.parseEmbeddedState(html, data);
    this.parseMetaTags(html, data);
    this.parseCheerioSelectors(html, data);

    return data;
  }

  private parseEmbeddedState(html: string, data: ProductData) {
    // Shopee embeds product JSON in window.__INITIAL_STATE__
    const priceMinMatch = html.match(/"price_min"\s*:\s*(\d+)/);
    const priceMaxMatch = html.match(/"price_max"\s*:\s*(\d+)/);
    const priceMatch = html.match(/"price"\s*:\s*(\d+)/);

    const rawPrice = priceMinMatch?.[1] || priceMaxMatch?.[1] || priceMatch?.[1];
    if (rawPrice) {
      data.price = this.normalizePrice(parseInt(rawPrice, 10));
    }

    const originalMatch = html.match(/"price_before_discount"\s*:\s*(\d+)/) || html.match(/"original_price"\s*:\s*(\d+)/);
    if (originalMatch) {
      data.originalPrice = this.normalizePrice(parseInt(originalMatch[1], 10));
    }

    const nameMatch = html.match(/"name"\s*:\s*"([^"]{5,300})"/);
    if (nameMatch) {
      data.name = this.decodeUnicode(nameMatch[1]);
    }

    const stockMatch = html.match(/"stock"\s*:\s*(\d+)/);
    if (stockMatch) {
      const stock = parseInt(stockMatch[1], 10);
      data.stockStatus = stock > 0 ? 'available' : 'out_of_stock';
    }
  }

  private parseMetaTags(html: string, data: ProductData) {
    const $ = cheerio.load(html);

    if (!data.name) {
      data.name = $('meta[property="og:title"]').attr('content') || '';
    }

    if (!data.imageUrl) {
      data.imageUrl = $('meta[property="og:image"]').attr('content') || null;
    }
  }

  private parseCheerioSelectors(html: string, data: ProductData) {
    const $ = cheerio.load(html);

    if (!data.name) {
      const nameSelectors = ['[class*="title"]', 'h1', '.product-name', '.item-title'];
      for (const selector of nameSelectors) {
        const name = $(selector).first().text().trim();
        if (name) {
          data.name = name;
          break;
        }
      }
    }

    if (data.price === null) {
      const priceSelectors = [
        '[class*="price"]',
        '[data-feature="item_current_price"]',
        '.price',
        '.item-price'
      ];
      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        const price = this.extractPrice(priceText);
        if (price !== null) {
          data.price = price;
          break;
        }
      }
    }
  }

  private normalizePrice(value: number): number {
    // Shopee embeds prices scaled by 100000 (e.g. Rp120.000 = 12000000000)
    if (value > 10_000_000) {
      return Math.round(value / PRICE_SCALE);
    }
    return value;
  }

  private decodeUnicode(str: string): string {
    try {
      return JSON.parse(`"${str}"`);
    } catch {
      return str;
    }
  }

  private extractPrice(text: string): number | null {
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length > 0) {
      return parseInt(cleaned, 10);
    }
    return null;
  }
}

export const shopeeParser = new CheerioParser();
