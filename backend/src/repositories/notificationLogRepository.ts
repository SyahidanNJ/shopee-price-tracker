import { NotificationLog } from '../models/notificationLog';

export const NotificationLogRepository = {
  create: async (data: any) => {
    return NotificationLog.create(data);
  },

  findByProductId: async (productId: string, options?: any) => {
    return NotificationLog.findAll({
      where: { productId },
      ...options
    });
  },

  findLatestByProductId: async (productId: string) => {
    return NotificationLog.findOne({
      where: { productId },
      order: [['sent_at', 'DESC']]
    });
  }
};
