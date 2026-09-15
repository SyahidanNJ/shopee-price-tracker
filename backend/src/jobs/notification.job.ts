import pino from 'pino';
import { config } from '../config';
import { TelegramBinding } from '../models/telegramBinding';
import { NotificationLog } from '../models/notificationLog';
import { Bot } from 'grammy';

const logger = pino();

export const notificationJob = {
  send: async (
    userId: string,
    productId: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    alertId?: string
  ): Promise<void> => {
    const binding = await TelegramBinding.findOne({
      where: { userId, isActive: true }
    });

    if (!binding || !binding.telegramUserId) {
      await NotificationLog.create({
        userId,
        productId,
        alertId: alertId || null,
        channel: 'telegram',
        status: 'skipped',
        errorMessage: 'Telegram not bound'
      });
      throw new Error('Telegram not bound');
    }

    const drop = oldPrice - newPrice;
    const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

    const message = `💰 Harga Produk Turun!

📦 Produk: ${productName}
📉 Harga lama: Rp ${oldPrice.toLocaleString('id-ID')}
📊 Harga baru: Rp ${newPrice.toLocaleString('id-ID')}
💵 Turun: Rp ${drop.toLocaleString('id-ID')} (${dropPercentage.toFixed(2)}%)

Cek produk: https://shopee.co.id/product/0/${productId}`;

    try {
      const bot = new Bot(config.telegramBotToken!);
      const sent = await bot.api.sendMessage(binding.telegramUserId, message);

      await NotificationLog.create({
        userId,
        productId,
        alertId: alertId || null,
        channel: 'telegram',
        status: 'sent',
        telegramMessageId: String(sent.message_id)
      });

      logger.info({ productId, telegramUserId: binding.telegramUserId }, 'Notification sent');
    } catch (error: any) {
      if (error.description?.includes('blocked by the user')) {
        await TelegramBinding.update(
          { isActive: false },
          { where: { userId } }
        );
        logger.warn({ userId }, 'Telegram binding deactivated (user blocked bot)');
      }

      await NotificationLog.create({
        userId,
        productId,
        alertId: alertId || null,
        channel: 'telegram',
        status: 'failed',
        errorMessage: error.message
      });

      throw error;
    }
  }
};
