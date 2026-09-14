import { bot } from './bot';

export default async function telegramWebhook(req: any, res: any) {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('ok');
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
}
