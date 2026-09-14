import { Alert } from '../models/alert';

export const alertRepository = {
  findByProductId: async (productId: string) => {
    return Alert.findOne({ where: { productId } });
  },

  findById: async (id: string) => {
    return Alert.findByPk(id);
  },

  create: async (data: Partial<Alert>) => {
    return Alert.create(data);
  },

  update: async (productId: string, data: Partial<Alert>) => {
    return Alert.update(data, { where: { productId } });
  },

  delete: async (productId: string) => {
    return Alert.destroy({ where: { productId } });
  }
};
