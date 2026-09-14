import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerRequest, loginRequest } from '../validators/auth.validator';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { error, data } = registerRequest.safeParse(req.body);
      if (error) {
        return res.status(400).json({ error: error.errors[0].message });
      }

      const result = await authService.register(data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { error, data } = loginRequest.safeParse(req.body);
      if (error) {
        return res.status(400).json({ error: error.errors[0].message });
      }

      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
      }

      const result = await authService.refreshTokens(refreshToken);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      await authService.logout(req.user!.userId);
      res.json({ message: 'Logged out' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  me: async (req: Request, res: Response) => {
    try {
      const user = await authService.getCurrentUser(req.user!.userId);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
};
