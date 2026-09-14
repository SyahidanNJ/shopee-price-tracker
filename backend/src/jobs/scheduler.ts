import cron from 'node-cron';
import pino from 'pino';
import { config } from '../config';

const logger = pino();

export interface SchedulerStatus {
  running: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  errors: number;
}

export interface SchedulerOptions {
  intervalMinutes?: number;
  onTask: (products: any[]) => Promise<void>;
}

export class Scheduler {
  private job: cron.ScheduledTask | null = null;
  private status: SchedulerStatus = {
    running: false,
    lastRun: null,
    nextRun: null,
    errors: 0
  };

  start(options: SchedulerOptions) {
    if (this.job) {
      logger.warn('Scheduler already running');
      return;
    }

    const intervalMinutes = options.intervalMinutes || config.priceCheckIntervalMinutes;
    const cronExpression = `*/${intervalMinutes} * * * *`;

    logger.info(`Starting scheduler with interval ${intervalMinutes} minutes`);

    this.job = cron.schedule(cronExpression, async () => {
      this.status.lastRun = new Date();
      
      try {
        logger.info('Scheduler task started');
        await options.onTask([]);
        this.status.errors = 0;
      } catch (error: any) {
        logger.error({
          message: error.message,
          stack: error.stack
        }, 'Scheduler task failed');
        this.status.errors++;
      }
    });

    this.status.running = true;
    logger.info('Scheduler started successfully');
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      this.status.running = false;
      logger.info('Scheduler stopped');
    }
  }

  getStatus(): SchedulerStatus {
    return this.status;
  }
}

export const scheduler = new Scheduler();
