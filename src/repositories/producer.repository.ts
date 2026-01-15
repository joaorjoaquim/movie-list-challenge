import { getConnection } from '../config/database';

export interface Producer {
  id: number;
  name: string;
}

export class ProducerRepository {
  async findAll(): Promise<Producer[]> {
    const db = getConnection();
    return await db.public.many(
      `SELECT id, name FROM producers ORDER BY name ASC`
    );
  }

  async findWithMultipleWins(): Promise<Producer[]> {
    const db = getConnection();
    try {
      return await db.public.many(
        `SELECT p.id, p.name
         FROM producers p
         INNER JOIN movie_producers mp ON p.id = mp.producer_id
         INNER JOIN movies m ON mp.movie_id = m.id
         WHERE m.winner = true
         GROUP BY p.id, p.name
         HAVING COUNT(m.id) >= 2
         ORDER BY p.name ASC`
      );
    } catch {
      return [];
    }
  }
}
