import { Op } from 'sequelize';
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
  },

  findPreviousPrice: async (productId: string): Promise<number | null> => {
    const snapshots = await PriceSnapshot.findAll({
      where: { productId, price: { [Op.ne]: null } },
      order: [['created_at', 'DESC']],
      limit: 2
    });
    return snapshots.length > 1 ? snapshots[1].price : null;
  }
};
