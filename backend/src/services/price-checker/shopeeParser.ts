import * as cheerio from 'cheerio';

export interface ProductData {
  name: string;
  price: number | null;
  originalPrice: number | null;
  discountPrice: number | null;
  imageUrl: string | null;
  stockStatus: string | null;
}

export interface ShopeeParser {
  parse(html: string): ProductData;
}

export class CheerioParser implements ShopeeParser {
  parse(html: string): ProductData {
    const $ = cheerio.load(html);
    const data: ProductData = {
      name: '',
      price: null,
      originalPrice: null,
      discountPrice: null,
      imageUrl: null,
      stockStatus: null
    };

    const nameSelectors = [
      '[class*="title"]',
      '[data-feature="item_name"]',
      'h1',
      '.product-name',
      '.item-title'
    ];

    for (const selector of nameSelectors) {
      const name = $(selector).first().text().trim();
      if (name) {
        data.name = name;
        break;
      }
    }

    const priceSelectors = [
      '[class*="price"]',
      '[data-feature="item_current_price"]',
      '.price',
      '.item-price',
      '[class*="current-price"]'
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      const price = this.extractPrice(priceText);
      if (price !== null) {
        data.price = price;
        break;
      }
    }

    const originalPriceSelectors = [
      '[class*="original-price"]',
      '[data-feature="item_original_price"]',
      '.original-price',
      '.price-original',
      '.strikethrough'
    ];

    for (const selector of originalPriceSelectors) {
      const priceText = $(selector).first().text().trim();
      const price = this.extractPrice(priceText);
      if (price !== null) {
        data.originalPrice = price;
        break;
      }
    }

    const discountPriceSelectors = [
      '[class*="discount-price"]',
      '[data-feature="item_discount_price"]',
      '.discount-price'
    ];

    for (const selector of discountPriceSelectors) {
      const priceText = $(selector).first().text().trim();
      const price = this.extractPrice(priceText);
      if (price !== null) {
        data.discountPrice = price;
        break;
      }
    }

    const imageSelectors = [
      '[class*="product-image"]',
      '[data-feature="item_image"]',
      'img[class*="product"]',
      'meta[property="og:image"]'
    ];

    for (const selector of imageSelectors) {
      const src = $(selector).first().attr('src') || $(selector).first().attr('content');
      if (src) {
        data.imageUrl = src;
        break;
      }
    }

    const stockSelectors = [
      '[class*="stock"]',
      '[data-feature="item_stock"]',
      '.stock-status',
      '[class*="stock"]'
    ];

    for (const selector of stockSelectors) {
      const stockText = $(selector).first().text().trim();
      if (stockText) {
        const text = stockText.toLowerCase();
        if (text.includes('sold') || text.includes('terjual')) {
          data.stockStatus = 'available';
        } else if (text.includes('out of stock') || text.includes('habis') || text.includes('kosong')) {
          data.stockStatus = 'out_of_stock';
        } else {
          data.stockStatus = 'available';
        }
        break;
      }
    }

    return data;
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
