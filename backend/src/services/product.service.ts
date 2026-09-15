import { productRepository } from '../repositories/productRepository';
import { priceChecker } from './price-checker/priceChecker';
import {
  normalizeShopeeUrl,
  extractShopeeIds,
  validateShopeeUrl,
  resolveShortUrl
} from './price-checker/urlNormalizer';

export const productService = {
  create: async (userId: string, data: { sourceUrl: string }) => {
    if (!validateShopeeUrl(data.sourceUrl)) {
      throw new Error('Invalid Shopee URL');
    }

    const resolvedUrl = await resolveShortUrl(data.sourceUrl);
    const normalizedUrl = normalizeShopeeUrl(resolvedUrl);
    const ids = extractShopeeIds(resolvedUrl);

    const existing = await productRepository.findByNormalizedUrl(userId, normalizedUrl);
    if (existing) {
      throw new Error('Product already exists');
    }

    const product = await productRepository.create({
      userId,
      name: 'Loading...',
      sourceUrl: data.sourceUrl,
      normalizedUrl,
      shopeeItemId: ids.itemId,
      shopeeShopId: ids.shopId,
      status: 'active'
    });

    const result = await priceChecker.check(product.id, normalizedUrl);

    let status = 'active';
    let name = 'Unknown Product';
    let currentPrice = null;
    let imageUrl = null;

    if (result.success && result.data) {
      name = result.data.name || 'Unknown Product';
      currentPrice = result.data.price;
      imageUrl = result.data.imageUrl;
      if (result.data.price === null) {
        status = 'error';
      }
      if (result.data.stockStatus === 'out_of_stock') {
        status = 'out_of_stock';
      }
    } else {
      status = 'error';
    }

    await productRepository.update(product.id, {
      name,
      currentPrice,
      imageUrl,
      status,
      lastCheckedAt: new Date()
    });

    return productRepository.findById(product.id);
  },

  findAll: async (userId: string) => {
    return productRepository.findByUserId(userId);
  },

  findById: async (userId: string, id: string) => {
    const product = await productRepository.findByIdAndUserId(id, userId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  update: async (userId: string, id: string, data: any) => {
    const product = await productRepository.findByIdAndUserId(id, userId);
    if (!product) {
      throw new Error('Product not found');
    }
    await productRepository.update(id, data);
    return productRepository.findById(id);
  },

  delete: async (userId: string, id: string) => {
    const deleted = await productRepository.deleteByIdAndUserId(id, userId);
    if (deleted === 0) {
      throw new Error('Product not found');
    }
  }
};

