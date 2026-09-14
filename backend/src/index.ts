import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import 'dotenv/config';

const logger = pino();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Health endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
