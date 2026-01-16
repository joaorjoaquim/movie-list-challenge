import { IRequest } from '../domain/interfaces/http/IRequest';
import { IResponse } from '../domain/interfaces/http/IResponse';
import { IIntervalService } from '../domain/interfaces/services/IIntervalService';

export class ProducersController {
  constructor(
    private intervalService: IIntervalService
  ) {}

  async getIntervals(req: IRequest, res: IResponse): Promise<void> {
    try {
      const intervals = await this.intervalService.calculateIntervals();
      res.status(200).json(intervals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
