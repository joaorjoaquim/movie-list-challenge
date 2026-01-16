import { IRouter } from '../domain/interfaces/http/IRouter';
import { container } from '../config/container';

export function createProducersRoutes(router: IRouter): void {
  router.get('/producers/intervals', (req, res) => {
    const producersController = container.getProducersController();
    return producersController.getIntervals(req, res);
  });
}
