import { alertRepository } from '../repositories/alertRepository';
import { productRepository } from '../repositories/productRepository';

export const alertService = {
  findByProductId: async (userId: string, productId: string) => {
    const product = await productRepository.findByIdAndUserId(productId, userId);
    if (!product) {
      throw new Error('Product not found');
    }

    const alert = await alertRepository.findByProductId(productId);
    return alert;
  },

  createOrUpdate: async (userId: string, productId: string, data: any) => {
    const product = await productRepository.findByIdAndUserId(productId, userId);
    if (!product) {
      throw new Error('Product not found');
    }

    const existing = await alertRepository.findByProductId(productId);
    if (existing) {
      await alertRepository.update(productId, data);
      return alertRepository.findByProductId(productId);
    }

    return alertRepository.create({
      userId,
      productId,
      ...data
    });
  },

  delete: async (userId: string, productId: string) => {
    const product = await productRepository.findByIdAndUserId(productId, userId);
    if (!product) {
      throw new Error('Product not found');
    }

    await alertRepository.delete(productId);
  }
};
