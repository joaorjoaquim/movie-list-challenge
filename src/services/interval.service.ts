import { MovieRepository } from '../repositories/movie.repository';
import { ProducerRepository } from '../repositories/producer.repository';

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export class IntervalService {
  constructor(
    private movieRepository: MovieRepository,
    private producerRepository: ProducerRepository
  ) {}

  async calculateIntervals(): Promise<{
    min: ProducerInterval[];
    max: ProducerInterval[];
  }> {
    const producers = await this.producerRepository.findWithMultipleWins();
    const allIntervals: ProducerInterval[] = [];

    for (const producer of producers) {
      const movies = await this.movieRepository.findWinnersByProducer(
        producer.id
      );

      if (movies.length < 2) continue;

      for (let i = 0; i < movies.length - 1; i++) {
        const previousWin = movies[i].year;
        const followingWin = movies[i + 1].year;
        const interval = followingWin - previousWin;

        allIntervals.push({
          producer: producer.name,
          interval,
          previousWin,
          followingWin,
        });
      }
    }

    if (allIntervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...allIntervals.map((i) => i.interval));
    const maxInterval = Math.max(...allIntervals.map((i) => i.interval));

    const min = allIntervals.filter((i) => i.interval === minInterval);
    const max = allIntervals.filter((i) => i.interval === maxInterval);

    return { min, max };
  }
}
