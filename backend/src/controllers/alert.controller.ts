import { Request, Response } from 'express';
import { alertService } from '../services/alert.service';
import { updateAlertRequest } from '../validators/alert.validator';

export const alertController = {
  get: async (req: Request, res: Response) => {
    try {
      const alert = await alertService.findByProductId(req.user!.userId, req.params.id);
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      res.json(alert);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { error, data } = updateAlertRequest.safeParse(req.body);
      if (error) {
        return res.status(400).json({ error: error.errors[0].message });
      }

      const alert = await alertService.createOrUpdate(req.user!.userId, req.params.id, data);
      res.json(alert);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
