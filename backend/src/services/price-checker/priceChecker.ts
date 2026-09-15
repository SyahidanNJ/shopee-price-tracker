import axios, { AxiosError } from 'axios';
import pino from 'pino';
import { config } from '../../config';
import { shopeeParser, ProductData } from './shopeeParser';
import { priceSnapshotRepository } from '../../repositories/priceSnapshotRepository';
import { priceCheckLogRepository } from '../../repositories/priceCheckLogRepository';
import { productRepository } from '../../repositories/productRepository';

const logger = pino();

export interface PriceCheckResult {
  success: boolean;
  data?: ProductData;
  error?: string;
}

export interface PriceCheckService {
  check(productId: string, url: string): Promise<PriceCheckResult>;
  checkWithRetry(productId: string, url: string, maxRetries?: number): Promise<PriceCheckResult>;
}

export class ShopeePriceChecker implements PriceCheckService {
  private timeout: number;
  private retries: number;

  constructor() {
    this.timeout = config.priceCheckTimeoutMs;
    this.retries = 2;
  }

  async check(productId: string, url: string): Promise<PriceCheckResult> {
    const startTime = Date.now();

    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8'
        },
        maxRedirects: 5
      });

      const data = shopeeParser.parse(response.data);

      await productRepository.update(productId, { lastCheckedAt: new Date() });

      if (data.price === null) {
        await productRepository.update(productId, { status: 'error' });
        await this.logCheckResult(productId, 'error', 'Price not found', Date.now() - startTime);
        return { success: false, error: 'Price not found in page' };
      }

      const updates: any = {
        currentPrice: data.price,
        lastCheckedAt: new Date()
      };

      if (data.name) updates.name = data.name;
      if (data.imageUrl) updates.imageUrl = data.imageUrl;

      if (data.stockStatus === 'out_of_stock') {
        updates.status = 'out_of_stock';
      } else if (data.stockStatus === 'available') {
        updates.status = 'active';
      }

      await productRepository.update(productId, updates);

      await priceSnapshotRepository.create({
        productId,
        price: data.price,
        originalPrice: data.originalPrice,
        discountPrice: data.discountPrice,
        stockStatus: data.stockStatus,
        rawData: {
          name: data.name,
          imageUrl: data.imageUrl,
          timestamp: new Date().toISOString()
        }
      });

      await this.logCheckResult(productId, 'success', undefined, Date.now() - startTime);
      return { success: true, data };

    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const message = axiosError.message || 'Unknown error';

      if (status === 404) {
        await productRepository.update(productId, { status: 'not_found', lastCheckedAt: new Date() });
        await this.logCheckResult(productId, 'not_found', 'HTTP 404', Date.now() - startTime);
      } else {
        await productRepository.update(productId, { status: 'error', lastCheckedAt: new Date() });
        await this.logCheckResult(productId, 'error', message, Date.now() - startTime);
      }

      return { success: false, error: message };
    }
  }

  async checkWithRetry(productId: string, url: string, maxRetries: number = this.retries): Promise<PriceCheckResult> {
    for (let i = 0; i <= maxRetries; i++) {
      const result = await this.check(productId, url);
      
      if (result.success) {
        return result;
      }

      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return { success: false, error: 'Failed after retries' };
  }

  private async logCheckResult(
    productId: string,
    status: string,
    error: string | undefined,
    durationMs: number
  ) {
    await priceCheckLogRepository.create({
      productId,
      status,
      errorMessage: error || null,
      durationMs,
      created_at: new Date()
    });
  }
}

export const priceChecker = new ShopeePriceChecker();
