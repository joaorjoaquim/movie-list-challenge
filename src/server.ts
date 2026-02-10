import { createApp } from './app';
import { initializeDatabase } from './config/database';
import { logger } from './infrastructure/logger/logger';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();
    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Documentation available at http://localhost:${PORT}/api-docs`);
    });

    const shutdown = () => {
      logger.info('Shutting down server...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
