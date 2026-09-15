import { config } from '../config';
import { telegramBindingRepository } from '../repositories/telegramBindingRepository';
import { Bot } from 'grammy';

const generateBindingCode = () => {
  return 'BIND_' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const telegramService = {
  createBindingCode: async (userId: string) => {
    const existing = await telegramBindingRepository.findByUserId(userId);
    if (existing) {
      await telegramBindingRepository.update(existing.id, {
        bindingCode: generateBindingCode(),
        telegramUserId: null,
        isActive: false
      });
      return telegramBindingRepository.findById(existing.id);
    }

    return telegramBindingRepository.create({
      userId,
      bindingCode: generateBindingCode(),
      telegramUserId: null,
      isActive: false
    });
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

    if (!binding || !binding.isActive || !binding.telegramUserId) {
      return { isBound: false };
    }

    return {
      isBound: true,
      telegramUserId: binding.telegramUserId,
      telegramUsername: binding.telegramUsername
    };
  },

  unbind: async (userId: string) => {
    const binding = await telegramBindingRepository.findByUserId(userId);

    if (!binding) {
      throw new Error('Telegram not bound');
    }

    await telegramBindingRepository.update(binding.id, {
      isActive: false,
      telegramUserId: null
    });
  },

  sendTestNotification: async (telegramUserId: string) => {
    const message = `✅ Test Notification

This is a test notification from Shopee Price Tracker.
If you see this message, Telegram is connected properly.`;

    const bot = new Bot(config.telegramBotToken!);
    await bot.api.sendMessage(telegramUserId, message);
    return true;
  }
};
