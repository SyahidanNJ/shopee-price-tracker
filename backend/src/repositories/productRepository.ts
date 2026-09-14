import { Product } from '../models/product';

export const productRepository = {
  create: async (data: Partial<Product>) => {
    return Product.create(data);
  },

  findByUserId: async (userId: string, options?: any) => {
    return Product.findAll({
      where: { userId },
      ...options
    });
  },

  findByIdAndUserId: async (id: string, userId: string) => {
    return Product.findOne({
      where: { id, userId }
    });
  },

  findById: async (id: string) => {
    return Product.findByPk(id);
  },

  findByNormalizedUrl: async (userId: string, normalizedUrl: string) => {
    return Product.findOne({
      where: { userId, normalizedUrl }
    });
  },

  update: async (id: string, data: Partial<Product>) => {
    return Product.update(data, { where: { id } });
  },

  deleteById: async (id: string) => {
    return Product.destroy({ where: { id } });
  },

  deleteByIdAndUserId: async (id: string, userId: string) => {
    return Product.destroy({ where: { id, userId } });
  }
};
