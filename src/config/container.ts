import { MovieRepository } from '../repositories/movie.repository';
import { ProducerRepository } from '../repositories/producer.repository';
import { IntervalService } from '../services/interval.service';
import { ProducersController } from '../controllers/producers.controller';
import { getConnection } from './database';
import { IMovieRepository } from '../domain/interfaces/repositories/IMovieRepository';
import { IProducerRepository } from '../domain/interfaces/repositories/IProducerRepository';
import { IIntervalService } from '../domain/interfaces/services/IIntervalService';

export class DependencyContainer {
  private _movieRepository?: IMovieRepository;
  private _producerRepository?: IProducerRepository;
  private _intervalService?: IIntervalService;
  private _producersController?: ProducersController;

  getMovieRepository(): IMovieRepository {
    if (!this._movieRepository) {
      const dbConnection = getConnection();
      this._movieRepository = new MovieRepository(dbConnection);
    }
    return this._movieRepository;
  }

  getProducerRepository(): IProducerRepository {
    if (!this._producerRepository) {
      const dbConnection = getConnection();
      this._producerRepository = new ProducerRepository(dbConnection);
    }
    return this._producerRepository;
  }

  getIntervalService(): IIntervalService {
    if (!this._intervalService) {
      this._intervalService = new IntervalService(
        this.getMovieRepository(),
        this.getProducerRepository()
      );
    }
    return this._intervalService;
  }

  getProducersController(): ProducersController {
    if (!this._producersController) {
      this._producersController = new ProducersController(
        this.getIntervalService()
      );
    }
    return this._producersController;
  }

  reset(): void {
    this._movieRepository = undefined;
    this._producerRepository = undefined;
    this._intervalService = undefined;
    this._producersController = undefined;
  }
}

export const container = new DependencyContainer();
