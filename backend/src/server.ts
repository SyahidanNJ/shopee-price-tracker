import { app, config } from './app';
import { initializeScheduler } from './jobs';

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.env} mode`);
    });

    if (config.env === 'development') {
      await initializeScheduler();
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
