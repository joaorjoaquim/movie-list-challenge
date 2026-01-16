import { IMemoryDb } from 'pg-mem';

export interface IDatabaseConnection {
  query(sql: string, params?: any[]): Promise<any[]>;
  one(sql: string, params?: any[]): Promise<any>;
  many(sql: string, params?: any[]): Promise<any[]>;
  none(sql: string, params?: any[]): Promise<void>;
}

export class PgMemConnection implements IDatabaseConnection {
  constructor(private db: IMemoryDb) {}

  async query(sql: string, params?: any[]): Promise<any[]> {
    return await this.db.public.many(sql);
  }

  async one(sql: string, params?: any[]): Promise<any> {
    return await this.db.public.one(sql);
  }

  async many(sql: string, params?: any[]): Promise<any[]> {
    return await this.db.public.many(sql);
  }

  async none(sql: string, params?: any[]): Promise<void> {
    await this.db.public.none(sql);
  }
}
