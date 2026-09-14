import axios, { AxiosError } from 'axios';
import pino from 'pino';
import { config } from '../../config';
import { shopeeParser, ProductData } from './shopeeParser';
import { priceSnapshotRepository } from '../../repositories/priceSnapshotRepository';
import { priceCheckLogRepository } from '../../repositories/priceCheckLogRepository';

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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        maxRedirects: 5
      });

      const data = shopeeParser.parse(response.data);

      if (data.price === null) {
        await this.logCheckResult(productId, 'error', 'Price not found', Date.now() - startTime);
        return { success: false, error: 'Price not found in page' };
      }

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
      const message = axiosError.message || 'Unknown error';
      await this.logCheckResult(productId, 'error', message, Date.now() - startTime);
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
