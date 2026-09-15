import { Request, Response } from 'express';
import { telegramService } from '../services/telegram.service';

export const telegramController = {
  getStatus: async (req: Request, res: Response) => {
    try {
      const status = await telegramService.getStatus(req.user!.userId);
      res.json(status);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  bind: async (req: Request, res: Response) => {
    try {
      const binding = await telegramService.createBindingCode(req.user!.userId);
      res.status(201).json({
        bindingCode: binding!.bindingCode,
        message: 'Use /bind BINDING_CODE in Telegram bot to connect'
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  unbind: async (req: Request, res: Response) => {
    try {
      await telegramService.unbind(req.user!.userId);
      res.json({ message: 'Telegram unbound successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  test: async (req: Request, res: Response) => {
    try {
      const status = await telegramService.getStatus(req.user!.userId);
      
      if (!status.isBound) {
        return res.status(400).json({ error: 'Telegram not bound. Bind first using /bind in Telegram.' });
      }

      await telegramService.sendTestNotification(status.telegramUserId!);
      res.json({ message: 'Test notification sent' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
