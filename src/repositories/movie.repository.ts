import { IMovieRepository } from '../domain/interfaces/repositories/IMovieRepository';
import { Movie } from '../domain/entities/Movie';
import { IDatabaseConnection } from '../infrastructure/database/pg-mem/PgMemConnection';

export class MovieRepository implements IMovieRepository {
  constructor(private db: IDatabaseConnection) {}

  async findAllWinners(): Promise<Movie[]> {
    return await this.db.many(
      `SELECT id, year, title, studios, winner 
       FROM movies 
       WHERE winner = true 
       ORDER BY year ASC`
    );
  }

  async findWinnersByProducer(producerId: number): Promise<Movie[]> {
    try {
      return await this.db.many(
        `SELECT m.id, m.year, m.title, m.studios, m.winner
         FROM movies m
         INNER JOIN movie_producers mp ON m.id = mp.movie_id
         WHERE mp.producer_id = ${producerId} AND m.winner = true
         ORDER BY m.year ASC`
      );
    } catch {
      return [];
    }
  }
}
