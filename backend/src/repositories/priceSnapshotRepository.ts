import { PriceSnapshot } from '../models/priceSnapshot';

export const priceSnapshotRepository = {
  create: async (data: any) => {
    return PriceSnapshot.create(data);
  },

  findByProductId: async (productId: string, options?: any) => {
    return PriceSnapshot.findAll({
      where: { productId },
      ...options
    });
  },

  findLatestByProductId: async (productId: string) => {
    return PriceSnapshot.findOne({
      where: { productId },
      order: [['created_at', 'DESC']]
    });
  }
};
