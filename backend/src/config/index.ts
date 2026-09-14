import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
  priceCheckIntervalMinutes: Number(process.env.PRICE_CHECK_INTERVAL_MINUTES) || 30,
  priceCheckTimeoutMs: Number(process.env.PRICE_CHECK_TIMEOUT_MS) || 15000,
  priceCheckDelayMs: Number(process.env.PRICE_CHECK_DELAY_MS) || 3000
};
