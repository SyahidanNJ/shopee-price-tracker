import { config } from '../config';
import { bot } from './bot';

export const initializeTelegram = () => {
  if (config.telegramBotToken) {
    if (config.telegramWebhookSecret) {
      console.log('Starting bot in webhook mode');
      bot.webhook.listen('/webhook/telegram', {
        port: config.port,
        secretToken: config.telegramWebhookSecret
      });
    } else {
      console.log('Starting bot in long polling mode');
      bot.start();
    }
  } else {
    console.log('Telegram bot not configured');
  }
};

export const stopTelegram = async () => {
  await bot.stop();
};
