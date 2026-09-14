import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { testConnection } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { apiRoutes } from '../routes/api';
import pino from 'pino';

const logger = pino();
export const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

// Body parser
app.use(express.json());

// Rate limiter for API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Health check (outside API prefix)
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'ok',
      database: dbConnected ? 'connected' : 'not_connected',
      telegram: config.telegramBotToken ? 'configured' : 'not_configured',
      scheduler: 'not_started',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.json({
      status: 'ok',
      database: 'not_connected',
      telegram: config.telegramBotToken ? 'configured' : 'not_configured',
      scheduler: 'not_started',
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use('/api', apiRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Export app for testing
export default app;
