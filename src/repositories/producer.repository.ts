import { IProducerRepository } from '../domain/interfaces/repositories/IProducerRepository';
import { Producer } from '../domain/entities/Producer';
import { IDatabaseConnection } from '../infrastructure/database/pg-mem/PgMemConnection';

export class ProducerRepository implements IProducerRepository {
  constructor(private db: IDatabaseConnection) {}

  async findAll(): Promise<Producer[]> {
    return await this.db.many(
      `SELECT id, name FROM producers ORDER BY name ASC`
    );
  }

  async findWithMultipleWins(): Promise<Producer[]> {
    try {
      const allProducersWithWins = await this.db.many(
        `SELECT p.id, p.name, COUNT(m.id) as win_count
         FROM producers p
         INNER JOIN movie_producers mp ON p.id = mp.producer_id
         INNER JOIN movies m ON mp.movie_id = m.id
         WHERE m.winner = true
         GROUP BY p.id, p.name
         ORDER BY p.name ASC`
      );
      
      return allProducersWithWins
        .filter((p: Producer & { win_count: number }) => p.win_count >= 2)
        .map((p: Producer & { win_count: number }) => ({ id: p.id, name: p.name }));
    } catch {
      return [];
    }
  }
}
