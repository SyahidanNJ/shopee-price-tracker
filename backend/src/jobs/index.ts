import pino from 'pino';
import { config } from '../config';
import { scheduler } from '../jobs/scheduler';
import { priceCheckJob } from '../jobs/priceCheck.job';
import { notificationJob } from '../jobs/notification.job';

const logger = pino();

export const initializeScheduler = async () => {
  try {
    await scheduler.start({
      intervalMinutes: config.priceCheckIntervalMinutes,
      onTask: async () => {
        const results = await priceCheckJob.run();

        const notificationsSent = results.filter(r => r.shouldNotify).length;
        
        logger.info({
          totalProducts: results.length,
          successCount: results.filter(r => r.success).length,
          failedCount: results.filter(r => !r.success).length,
          notificationsSent
        }, 'Scheduler run completed');
      }
    });
  } catch (error: any) {
    logger.error({ message: error.message, stack: error.stack }, 'Failed to initialize scheduler');
  }
};

export const stopScheduler = () => {
  scheduler.stop();
};

export const getSchedulerStatus = () => {
  return scheduler.getStatus();
};
