import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { ExpressRouterAdapter } from './infrastructure/http/express/ExpressRouter';
import { createRoutes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { swaggerDocument } from './infrastructure/docs/swagger';

export function createApp() {
  const app = express();
  const expressRouter = express.Router();
  const router = new ExpressRouterAdapter(expressRouter);

  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  createRoutes(router);
  app.use('/api', expressRouter);

  app.use(errorMiddleware);

  return app;
}
