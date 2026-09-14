import { Response } from 'express';
import { config } from '../config';
import { userRepository } from '../repositories/userRepository';
import { NotificationLogRepository } from '../repositories/notificationLogRepository';

export interface NotificationJob {
  send: (userId: string, productId: string, alert: any, oldPrice: number, newPrice: number) => Promise<void>;
}

export class ShopeeNotificationJob implements NotificationJob {
  async send(
    userId: string,
    productId: string,
    alert: any,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const telegramBinding = require('../models').TelegramBinding;
      const binding = await telegramBinding.findOne({
        where: { userId, isActive: true }
      });

      if (!binding) {
        throw new Error('Telegram not bound');
      }

      const drop = oldPrice - newPrice;
      const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

      let message = '';
      if (alert.alertType === 'any_drop') {
        message = `
Price Drop Alert!

Product ID: ${productId}
Old Price: Rp ${oldPrice.toLocaleString()}
New Price: Rp ${newPrice.toLocaleString()}
Drop: Rp ${drop.toLocaleString()} (${dropPercentage.toFixed(2)}%)
`;
      } else if (alert.alertType === 'target_price') {
        message = `
Target Price Reached!

Product ID: ${productId}
Target Price: Rp ${(alert.targetPrice || 0).toLocaleString()}
Current Price: Rp ${newPrice.toLocaleString()}
`;
      }

      await notificationService.sendTelegramMessage(binding.telegramUserId, message);

      await NotificationLogRepository.create({
        userId,
        productId,
        alertId: alert.id,
        channel: 'telegram',
        status: 'sent'
      });

    } catch (error: any) {
      logger.error({
        userId,
        productId,
        message: error.message
      }, 'Notification failed');

      await NotificationLogRepository.create({
        userId,
        productId,
        alertId: alert.id,
        channel: 'telegram',
        status: 'failed',
        errorMessage: error.message
      });
    }
  }
}

export const notificationJob = new ShopeeNotificationJob();
