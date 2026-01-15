import { createApp } from './app';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();
    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
