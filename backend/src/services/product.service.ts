import { productRepository } from '../repositories/productRepository';
import { priceSnapshotRepository } from '../repositories/priceSnapshotRepository';

export const normalizeShopeeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    const itemMatch = path.match(/i\/(\d+)/);
    const shopMatch = path.match(/shopee\.co\.id\/([^/]+)/);
    
    if (itemMatch) {
      return `https://shopee.co.id/i/${itemMatch[1]}`;
    }
    if (shopMatch) {
      return `https://shopee.co.id/${shopMatch[1]}`;
    }
    return url;
  } catch {
    return url;
  }
};

export const extractShopeeIds = (url: string): { itemId?: string; shopId?: string } => {
  const itemId = url.match(/i\/(\d+)/)?.[1];
  const shopId = url.match(/shop\/(\d+)/)?.[1];
  return { itemId, shopId };
};

export const validateShopeeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('shopee.co.id') || parsed.hostname.includes('shopee.com');
  } catch {
    return false;
  }
};

export const productService = {
  create: async (userId: string, data: { sourceUrl: string }) => {
    if (!validateShopeeUrl(data.sourceUrl)) {
      throw new Error('Invalid Shopee URL');
    }

    const normalizedUrl = normalizeShopeeUrl(data.sourceUrl);
    const ids = extractShopeeIds(data.sourceUrl);

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

    await priceSnapshotRepository.create({
      productId: product.id,
      price: null,
      created_at: new Date()
    });

    return product;
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
