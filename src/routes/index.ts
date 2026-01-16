import { IRouter } from '../domain/interfaces/http/IRouter';
import { createProducersRoutes } from './producers.routes';

export function createRoutes(router: IRouter): void {
  createProducersRoutes(router);
}
