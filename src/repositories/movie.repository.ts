import { getConnection } from '../config/database';

export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string | null;
  winner: boolean;
}

export class MovieRepository {
  async findAllWinners(): Promise<Movie[]> {
    const db = getConnection();
    return await db.public.many(
      `SELECT id, year, title, studios, winner 
       FROM movies 
       WHERE winner = true 
       ORDER BY year ASC`
    );
  }

  async findWinnersByProducer(producerId: number): Promise<Movie[]> {
    const db = getConnection();
    try {
      return await db.public.many(
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
