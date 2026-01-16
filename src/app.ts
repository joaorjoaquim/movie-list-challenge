import express from 'express';
import { ExpressRouterAdapter } from './infrastructure/http/express/ExpressRouter';
import { createRoutes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export function createApp() {
  const app = express();
  const expressRouter = express.Router();
  const router = new ExpressRouterAdapter(expressRouter);

  app.use(express.json());
  
  createRoutes(router);
  app.use('/api', expressRouter);
  
  app.use(errorMiddleware);

  return app;
}
