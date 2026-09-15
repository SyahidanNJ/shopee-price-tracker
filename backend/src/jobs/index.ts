import pino from 'pino';
import { config } from '../config';
import { scheduler } from '../jobs/scheduler';
import { priceCheckJob } from '../jobs/priceCheck.job';

const logger = pino();

let schedulerStarted = false;

export const initializeScheduler = async () => {
  try {
    await scheduler.start({
      intervalMinutes: config.priceCheckIntervalMinutes,
      onTask: async () => {
        const results = await priceCheckJob.run();

        logger.info({
          totalProducts: results.length,
          successCount: results.filter(r => r.success).length,
          failedCount: results.filter(r => !r.success).length,
          notificationsSent: results.filter(r => r.notified).length
        }, 'Scheduler run completed');
      }
    });
    schedulerStarted = true;
  } catch (error: any) {
    logger.error({ message: error.message, stack: error.stack }, 'Failed to initialize scheduler');
  }
};

export const stopScheduler = () => {
  scheduler.stop();
  schedulerStarted = false;
};

export const isSchedulerRunning = () => schedulerStarted;
