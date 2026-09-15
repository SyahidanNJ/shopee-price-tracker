import { Request, Response } from 'express';
import { config } from '../../config';
import { bot } from './bot';

export default async function telegramWebhook(req: Request, res: Response) {
  // Validate secret token in production
  if (config.telegramWebhookSecret) {
    const secret = req.headers['x-telegram-bot-api-secret-token'];
    if (secret !== config.telegramWebhookSecret) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('ok');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}
