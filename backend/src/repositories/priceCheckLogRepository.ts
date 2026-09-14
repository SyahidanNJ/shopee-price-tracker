import { PriceCheckLog } from './priceCheckLog';

export const priceCheckLogRepository = {
  create: async (data: any) => {
    return PriceCheckLog.create(data);
  },

  findByProductId: async (productId: string, options?: any) => {
    return PriceCheckLog.findAll({
      where: { productId },
      ...options
    });
  },

  findLatestByProductId: async (productId: string) => {
    return PriceCheckLog.findOne({
      where: { productId },
      order: [['created_at', 'DESC']]
    });
  }
};
