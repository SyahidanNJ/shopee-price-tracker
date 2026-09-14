import { User } from './user';
import { RefreshToken } from './refreshToken';
import { Product, PriceSnapshot } from './products';
import { Alert } from './alert';
import { PriceCheckLog } from './priceCheckLog';
import { NotificationLog } from './notificationLog';
import { TelegramBinding } from './telegramBinding';

export const models = {
  User,
  RefreshToken,
  Product,
  PriceSnapshot,
  Alert,
  PriceCheckLog,
  NotificationLog,
  TelegramBinding
};

export { User, RefreshToken, Product, PriceSnapshot, Alert, PriceCheckLog, NotificationLog, TelegramBinding };
