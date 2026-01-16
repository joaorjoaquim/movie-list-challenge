import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

export type RouteHandler = (req: IRequest, res: IResponse) => Promise<void> | void;

export interface IRouter {
  get(path: string, handler: RouteHandler): void;
  post(path: string, handler: RouteHandler): void;
  put(path: string, handler: RouteHandler): void;
  delete(path: string, handler: RouteHandler): void;
  use(path: string, router: IRouter): void;
  use(handler: RouteHandler): void;
}
