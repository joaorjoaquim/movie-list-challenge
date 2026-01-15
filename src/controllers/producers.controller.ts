import { Request, Response } from 'express';
import { IntervalService } from '../services/interval.service';
import { MovieRepository } from '../repositories/movie.repository';
import { ProducerRepository } from '../repositories/producer.repository';

export class ProducersController {
  private intervalService: IntervalService;

  constructor() {
    const movieRepository = new MovieRepository();
    const producerRepository = new ProducerRepository();
    this.intervalService = new IntervalService(
      movieRepository,
      producerRepository
    );
  }

  async getIntervals(req: Request, res: Response): Promise<void> {
    try {
      const intervals = await this.intervalService.calculateIntervals();
      res.json(intervals);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
