import { newDb } from 'pg-mem';
import { readFileSync } from 'fs';
import { join } from 'path';

let db: any;

export async function initializeDatabase(): Promise<void> {
  db = newDb();
  db.public.registerFunction({
    name: 'current_database',
    implementation: () => 'test',
  });

  await createSchema();
  await loadCsvData();
}

async function createSchema(): Promise<void> {
  await db.public.none(`
    CREATE TABLE movies (
      id SERIAL PRIMARY KEY,
      year INTEGER NOT NULL,
      title VARCHAR(500) NOT NULL,
      studios VARCHAR(500),
      winner BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE producers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500) NOT NULL UNIQUE
    );

    CREATE TABLE movie_producers (
      movie_id INTEGER NOT NULL,
      producer_id INTEGER NOT NULL,
      PRIMARY KEY (movie_id, producer_id),
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
    );

    CREATE INDEX idx_movies_year ON movies(year);
    CREATE INDEX idx_movies_winner ON movies(winner);
    CREATE INDEX idx_producers_name ON producers(name);
  `);
}

async function loadCsvData(): Promise<void> {
  const csvPath = join(process.cwd(), 'movielist.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter((line) => line.trim());

  const { parseProducers } = await import('../utils/parseProducers');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const [year, title, studios, producers, winner] = line.split(';');

    if (!year || !title) continue;

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) continue;

    const isWinner = winner?.trim().toLowerCase() === 'yes';

    const movieResult = await db.public.one(
      `INSERT INTO movies (year, title, studios, winner) 
       VALUES (${yearNum}, '${title.trim().replace(/'/g, "''")}', ${studios?.trim() ? `'${studios.trim().replace(/'/g, "''")}'` : 'NULL'}, ${isWinner}) 
       RETURNING id`
    );

    const movieId = movieResult?.id;
    
    if (!movieId) {
      continue;
    }

    if (producers && producers.trim()) {
      const producerNames = parseProducers(producers);

      for (const producerName of producerNames) {
        const escapedName = producerName.replace(/'/g, "''");
        let producerResult = await db.public.many(
          `SELECT id FROM producers WHERE name = '${escapedName}'`
        );

        let producerId: number;

        if (producerResult.length === 0) {
          const insertResult = await db.public.one(
            `INSERT INTO producers (name) VALUES ('${escapedName}') RETURNING id`
          );
          producerId = insertResult.id;
        } else {
          producerId = producerResult[0].id;
        }

        await db.public.none(
          `INSERT INTO movie_producers (movie_id, producer_id) 
           VALUES (${movieId}, ${producerId}) 
           ON CONFLICT DO NOTHING`
        );
      }
    }
  }
}

export function getConnection() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
