import { config } from '../../config';
import { bot } from './bot';

export const initializeTelegram = () => {
  if (!config.telegramBotToken) {
    console.log('Telegram bot not configured, skipping');
    return;
  }

  if (config.env === 'production') {
    // Production: webhook mode, handled by Express route POST /webhook/telegram
    console.log('Telegram bot in webhook mode (use POST /webhook/telegram)');
  } else {
    // Development: long polling
    console.log('Telegram bot starting in long polling mode');
    bot.start({
      onStart: (me) => {
        console.log(`Telegram bot online: @${me.username}`);
      }
    });
  }
};

export const stopTelegram = async () => {
  await bot.stop();
};
