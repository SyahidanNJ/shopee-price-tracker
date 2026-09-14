import pino from 'pino';
import { config } from '../config';
import { Product } from '../models/product';
import { priceChecker } from '../services/price-checker/priceChecker';
import { alertRepository } from '../repositories/alertRepository';
import { priceSnapshotRepository } from '../repositories/priceSnapshotRepository';

const logger = pino();

export interface CheckResult {
  productId: string;
  success: boolean;
  oldPrice: number | null;
  newPrice: number | null;
  shouldNotify: boolean;
}

export const priceCheckJob = {
  run: async () => {
    const activeProducts = await Product.findAll({
      where: { status: 'active' }
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

      logger.info(`Checking product ${product.id} (${i + 1}/${activeProducts.length})`);

      try {
        const oldSnapshot = await priceSnapshotRepository.findLatestByProductId(product.id);
        const oldPrice = oldSnapshot?.price || null;

        const result = await priceChecker.check(product.id, product.normalizedUrl);

        const newPrice = result.success && result.data ? result.data.price : null;
        const shouldNotify = await shouldSendNotification(product, oldPrice, newPrice);

        results.push({
          productId: product.id,
          success: result.success,
          oldPrice,
          newPrice,
          shouldNotify
        });

        logger.info({
          productId: product.id,
          oldPrice,
          newPrice,
          shouldNotify
        }, 'Product check completed');

      } catch (error: any) {
        logger.error({
          productId: product.id,
          message: error.message
        }, 'Product check failed');
      }
    }

    return results;
  }
};

async function shouldSendNotification(
  product: Product,
  oldPrice: number | null,
  newPrice: number | null
): Promise<boolean> {
  // Check 1: Must have valid new price
  if (!newPrice || oldPrice === null) {
    return false;
  }

  // Check 2: Price must be lower (never notify on price increase)
  if (newPrice >= oldPrice) {
    return false;
  }

  // Check 3: Cooldown check
  if (product.lastNotifiedAt) {
    const cooldownMinutes = config.priceCheckIntervalMinutes || 30;
    const minutesSinceLast = (Date.now() - product.lastNotifiedAt.getTime()) / 60000;
    if (minutesSinceLast < cooldownMinutes) {
      return false;
    }
  }

  // Check 4: Duplicate prevention (same price as last notified)
  if (product.lastNotifiedPrice === newPrice) {
    return false;
  }

  // Check 5: Alert type conditions
  const alert = await alertRepository.findByProductId(product.id);
  if (!alert || !alert.isActive) {
    return false;
  }

  const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

  if (alert.alertType === 'any_drop') {
    return true;
  }

  if (alert.alertType === 'target_price' && newPrice <= (alert.targetPrice || 0)) {
    return true;
  }

  if (alert.alertType === 'min_drop_percentage' && dropPercentage >= (alert.minDropPercentage || 0)) {
    return true;
  }

  return false;
}

async function updateProductNotified(product: Product, newPrice: number) {
  await Product.update(
    {
      lastNotifiedPrice: newPrice,
      lastNotifiedAt: new Date()
    },
    {
      where: { id: product.id }
    }
  );
}

export { shouldSendNotification, updateProductNotified };
