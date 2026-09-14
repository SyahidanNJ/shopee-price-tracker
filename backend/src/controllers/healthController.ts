import { Request, Response, NextFunction } from 'express';

export const healthController = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: 'not_configured',
    telegram: 'not_configured',
    scheduler: 'not_started',
    timestamp: new Date().toISOString()
  });
};
