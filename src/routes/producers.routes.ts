import { IRouter } from '../domain/interfaces/http/IRouter';
import { container } from '../config/container';

export function createProducersRoutes(router: IRouter): void {
  const producersController = container.getProducersController();
  
  router.get('/producers/intervals', (req, res) => 
    producersController.getIntervals(req, res)
  );
}
