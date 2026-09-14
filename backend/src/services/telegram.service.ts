import { config } from '../config';
import { telegramBindingRepository } from '../repositories/telegramBindingRepository';
import { userRepository } from '../repositories/userRepository';
import { NotificationLogRepository } from '../repositories/notificationLogRepository';

const generateBindingCode = () => {
  return 'BIND_' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const telegramService = {
  createBindingCode: async (userId: string) => {
    await telegramBindingRepository.deactivateByUserId(userId);
    
    const binding = await telegramBindingRepository.create({
      userId,
      bindingCode: generateBindingCode()
    });

    return binding;
  },

  bindUser: async (bindingCode: string, telegramUserId: string, telegramUsername: string | null) => {
    const binding = await telegramBindingRepository.findByBindingCode(bindingCode);
    
    if (!binding) {
      throw new Error('Invalid or expired binding code');
    }

    await telegramBindingRepository.update(binding.id, {
      telegramUserId,
      telegramUsername,
      isActive: true
    });

    return binding;
  },

  getStatus: async (userId: string) => {
    const binding = await telegramBindingRepository.findByUserId(userId);
    
    if (!binding) {
      return { isBound: false };
    }

    return {
      isBound: binding.isActive,
      telegramUserId: binding.telegramUserId,
      telegramUsername: binding.telegramUsername
    };
  },

  unbind: async (userId: string) => {
    const binding = await telegramBindingRepository.findByUserId(userId);
    
    if (!binding) {
      throw new Error('Telegram not bound');
    }

    await telegramBindingRepository.delete(binding.id);
  },

  sendNotification: async (
    telegramUserId: string,
    productId: string,
    productName: string,
    oldPrice: number,
    newPrice: number,
    dropPercentage: number
  ) => {
    const drop = oldPrice - newPrice;
    const message = `
💰 Price Drop Alert!

📦 Product: ${productName}
📉 Old Price: Rp ${oldPrice.toLocaleString()}
📊 New Price: Rp ${newPrice.toLocaleString()}
💵 Drop: Rp ${drop.toLocaleString()} (${dropPercentage.toFixed(2)}%)

Cek produk: https://shopee.co.id/i/${productId}
`;

    try {
      const { Bot } = require('grammy');
      const bot = new Bot(config.telegramBotToken!);
      await bot.api.sendMessage(telegramUserId, message);

      await NotificationLogRepository.create({
        productId,
        channel: 'telegram',
        status: 'sent'
      });

    } catch (error: any) {
      if (error.description === 'Bad Request: bot was blocked by the user') {
        await telegramBindingRepository.deactivateByUserId(telegramUserId);
      }

      await NotificationLogRepository.create({
        productId,
        channel: 'telegram',
        status: 'failed',
        errorMessage: error.message
      });

      throw error;
    }
  },

  sendTestNotification: async (telegramUserId: string) => {
    const message = `
✅ Test Notification

This is a test notification from Shopee Price Tracker.
If you see this message, Telegram is connected properly.
`;

    try {
      const { Bot } = require('grammy');
      const bot = new Bot(config.telegramBotToken!);
      await bot.api.sendMessage(telegramUserId, message);
      return true;
    } catch (error: any) {
      throw error;
    }
  }
};
