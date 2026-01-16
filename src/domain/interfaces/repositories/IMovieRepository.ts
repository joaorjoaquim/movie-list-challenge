import { Movie } from '../../entities/Movie';

export interface IMovieRepository {
  findAllWinners(): Promise<Movie[]>;
  findWinnersByProducer(producerId: number): Promise<Movie[]>;
}
