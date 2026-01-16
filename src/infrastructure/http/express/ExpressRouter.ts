import { Router as ExpressRouter } from 'express';
import { IRouter, RouteHandler } from '../../../domain/interfaces/http/IRouter';
import { ExpressRequestAdapter } from './ExpressRequest';
import { ExpressResponseAdapter } from './ExpressResponse';

export class ExpressRouterAdapter implements IRouter {
  constructor(private expressRouter: ExpressRouter) {}

  getExpressRouter(): ExpressRouter {
    return this.expressRouter;
  }

  get(path: string, handler: RouteHandler): void {
    this.expressRouter.get(path, (req, res, next) => {
      const adaptedReq = new ExpressRequestAdapter(req);
      const adaptedRes = new ExpressResponseAdapter(res);
      Promise.resolve(handler(adaptedReq, adaptedRes)).catch(next);
    });
  }

  post(path: string, handler: RouteHandler): void {
    this.expressRouter.post(path, (req, res, next) => {
      const adaptedReq = new ExpressRequestAdapter(req);
      const adaptedRes = new ExpressResponseAdapter(res);
      Promise.resolve(handler(adaptedReq, adaptedRes)).catch(next);
    });
  }

  put(path: string, handler: RouteHandler): void {
    this.expressRouter.put(path, (req, res, next) => {
      const adaptedReq = new ExpressRequestAdapter(req);
      const adaptedRes = new ExpressResponseAdapter(res);
      Promise.resolve(handler(adaptedReq, adaptedRes)).catch(next);
    });
  }

  delete(path: string, handler: RouteHandler): void {
    this.expressRouter.delete(path, (req, res, next) => {
      const adaptedReq = new ExpressRequestAdapter(req);
      const adaptedRes = new ExpressResponseAdapter(res);
      Promise.resolve(handler(adaptedReq, adaptedRes)).catch(next);
    });
  }

  use(path: string, router: IRouter): void;
  use(handler: RouteHandler): void;
  use(pathOrHandler: string | RouteHandler, router?: IRouter): void {
    if (typeof pathOrHandler === 'string' && router) {
      const expressSubRouter = (router as ExpressRouterAdapter).getExpressRouter();
      this.expressRouter.use(pathOrHandler, expressSubRouter);
    } else if (typeof pathOrHandler === 'function') {
      this.expressRouter.use((req, res, next) => {
        const adaptedReq = new ExpressRequestAdapter(req);
        const adaptedRes = new ExpressResponseAdapter(res);
        Promise.resolve(pathOrHandler(adaptedReq, adaptedRes)).catch(next);
      });
    }
  }
}
