import pino from 'pino';
import { config } from '../config';
import { productRepository } from '../repositories/productRepository';
import { priceChecker } from '../services/price-checker/priceChecker';
import { alertRepository } from '../repositories/alertRepository';
import { priceSnapshotRepository } from '../repositories/priceSnapshotRepository';

const logger = pino();

export interface CheckResult {
  productId: string;
  success: boolean;
  oldPrice: number | null;
  newPrice: number | null;
  alert: any | null;
  shouldNotify: boolean;
}

export const priceCheckJob = {
  run: async () => {
    const products = await productRepository.findByUserId(
      // Get all products with status active
      ''
    ) as any[];

    // Query active products directly
    const { Product } = require('../models');
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
      
      // Delay between products
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, config.priceCheckDelayMs));
      }

      logger.info(`Checking product ${product.id} (${i + 1}/${activeProducts.length})`);

      try {
        const oldSnapshot = await priceSnapshotRepository.findLatestByProductId(product.id);
        const oldPrice = oldSnapshot?.price || null;

        const result = await priceChecker.check(product.id, product.normalizedUrl);

        const newPrice = result.success && result.data ? result.data.price : null;
        const alert = await alertRepository.findByProductId(product.id);

        // Check if notification should be sent
        const shouldNotify = checkAlertConditions(
          oldPrice,
          newPrice,
          alert
        );

        results.push({
          productId: product.id,
          success: result.success,
          oldPrice,
          newPrice,
          alert,
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

function checkAlertConditions(
  oldPrice: number | null,
  newPrice: number | null,
  alert: any | null
): boolean {
  if (!alert || !alert.isActive) {
    return false;
  }

  if (!newPrice || oldPrice === null) {
    return false;
  }

  if (newPrice >= oldPrice) {
    return false;
  }

  const shouldNotify = alert.alertType === 'any_drop' ||
    (alert.alertType === 'target_price' && newPrice <= (alert.targetPrice || 0)) ||
    (alert.alertType === 'min_drop_percentage' && calculateDropPercentage(oldPrice, newPrice) >= (alert.minDropPercentage || 0));

  return shouldNotify;
}

function calculateDropPercentage(oldPrice: number, newPrice: number): number {
  return ((oldPrice - newPrice) / oldPrice) * 100;
}
