import pino from 'pino';
import { config } from '../config';
import { Product } from '../models/product';
import { Alert } from '../models/alert';
import { priceChecker } from '../services/price-checker/priceChecker';
import { alertRepository } from '../repositories/alertRepository';
import { priceSnapshotRepository } from '../repositories/priceSnapshotRepository';
import { notificationJob } from './notification.job';

const logger = pino();

export interface CheckResult {
  productId: string;
  success: boolean;
  oldPrice: number | null;
  newPrice: number | null;
  notified: boolean;
}

export const priceCheckJob = {
  run: async () => {
    const activeProducts = await Product.findAll({
      where: { status: ['active', 'out_of_stock'] }
    });

    if (activeProducts.length === 0) {
      logger.info('No active products to check');
      return [];
    }

    logger.info(`Found ${activeProducts.length} active products to check`);

    const results: CheckResult[] = [];

    for (let i = 0; i < activeProducts.length; i++) {
      const product = activeProducts[i];

      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, config.priceCheckDelayMs));
      }

      logger.info({ productId: product.id, index: i + 1, total: activeProducts.length }, 'Checking product');

      try {
        const result = await priceChecker.check(product.id, product.normalizedUrl);
        const newPrice = result.success && result.data ? result.data.price : null;

        // Refresh product after price checker updated it
        await product.reload();
        const oldPrice = product.currentPrice === newPrice
          ? (await priceSnapshotRepository.findPreviousPrice(product.id))
          : product.currentPrice;

        const shouldNotify = await shouldSendNotification(product, oldPrice, newPrice);

        let notified = false;
        if (shouldNotify && newPrice && oldPrice) {
          const alert = await alertRepository.findByProductId(product.id);
          if (alert) {
            try {
              await notificationJob.send(
                product.userId,
                product.id,
                product.name,
                oldPrice,
                newPrice,
                alert.id
              );

              await Product.update(
                { lastNotifiedPrice: newPrice, lastNotifiedAt: new Date() },
                { where: { id: product.id } }
              );

              notified = true;
              logger.info({ productId: product.id, newPrice }, 'Notification sent');
            } catch (error: any) {
              logger.error({ productId: product.id, message: error.message }, 'Notification failed');
            }
          }
        }

        results.push({
          productId: product.id,
          success: result.success,
          oldPrice,
          newPrice,
          notified
        });
      } catch (error: any) {
        logger.error({ productId: product.id, message: error.message }, 'Product check failed');
        results.push({
          productId: product.id,
          success: false,
          oldPrice: null,
          newPrice: null,
          notified: false
        });
      }
    }

    const summary = {
      total: results.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      notificationsSent: results.filter(r => r.notified).length
    };
    logger.info(summary, 'Scheduler run summary');

    return results;
  }
};

async function shouldSendNotification(
  product: Product,
  oldPrice: number | null,
  newPrice: number | null
): Promise<boolean> {
  if (!newPrice || !oldPrice) {
    return false;
  }

  if (newPrice >= oldPrice) {
    return false;
  }

  const alert = await alertRepository.findByProductId(product.id);
  if (!alert || !alert.isActive) {
    return false;
  }

  // Cooldown check
  if (product.lastNotifiedAt) {
    const cooldownMinutes = alert.cooldownMinutes || 360;
    const minutesSinceLast = (Date.now() - product.lastNotifiedAt.getTime()) / 60000;
    if (minutesSinceLast < cooldownMinutes) {
      return false;
    }
  }

  // Duplicate prevention
  if (product.lastNotifiedPrice === newPrice) {
    return false;
  }

  const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

  if (alert.alertType === 'any_drop') {
    return true;
  }

  if (alert.alertType === 'target_price' && newPrice <= (alert.targetPrice || 0)) {
    return true;
  }

  if (alert.alertType === 'min_drop_percentage' && dropPercentage >= Number(alert.minDropPercentage || 0)) {
    return true;
  }

  return false;
}
