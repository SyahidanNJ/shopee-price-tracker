import { Response } from 'express';
import { TelegramBinding } from '../models/telegramBinding';
import { NotificationLog } from '../models/notificationLog';
import { User } from '../models/user';
import { config } from '../config';

export interface NotificationJob {
  send: (userId: string, productId: string, productName: string, oldPrice: number, newPrice: number) => Promise<void>;
}

export class ShopeeNotificationJob implements NotificationJob {
  async send(
    userId: string,
    productId: string,
    productName: string,
    oldPrice: number,
    newPrice: number
  ): Promise<void> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const binding = await TelegramBinding.findOne({
        where: { userId, isActive: true }
      });

      if (!binding) {
        throw new Error('Telegram not bound');
      }

      const drop = oldPrice - newPrice;
      const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

      const message = `
💰 Price Drop Alert!

📦 Product: ${productName}
📉 Old Price: Rp ${oldPrice.toLocaleString()}
📊 New Price: Rp ${newPrice.toLocaleString()}
💵 Drop: Rp ${drop.toLocaleString()} (${dropPercentage.toFixed(2)}%)

Cek produk: https://shopee.co.id/i/${productId}
`;

      const { Bot } = require('grammy');
      const bot = new Bot(config.telegramBotToken!);
      await bot.api.sendMessage(binding.telegramUserId, message);

      await NotificationLog.create({
        userId,
        productId,
        channel: 'telegram',
        status: 'sent'
      });

    } catch (error: any) {
      await NotificationLog.create({
        userId,
        productId,
        channel: 'telegram',
        status: 'failed',
        errorMessage: error.message
      });

      if (error.description === 'Bad Request: bot was blocked by the user') {
        await TelegramBinding.update(
          { isActive: false },
          { where: { userId } }
        );
      }

      throw error;
    }
  }
}

export const notificationJob = new ShopeeNotificationJob();
