import { Producer } from '../../entities/Producer';

export interface IProducerRepository {
  findAll(): Promise<Producer[]>;
  findWithMultipleWins(): Promise<Producer[]>;
}
