import { app } from './app';
import { config } from './config';
import { initializeScheduler } from './jobs';
import { initializeTelegram } from './integrations/telegram';

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.env} mode`);
    });

    if (config.env === 'development') {
      await initializeScheduler();
      initializeTelegram();
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
