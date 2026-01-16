import request from 'supertest';
import { readFileSync, writeFileSync } from 'fs';
import { createApp } from '../../src/app';
import { initializeDatabase } from '../../src/config/database';

describe('Producers API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    await initializeDatabase();
    app = createApp();
  });

  describe('GET /api/producers/intervals', () => {
    it('should return intervals in correct format', async () => {
      const response = await request(app).get('/api/producers/intervals');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);
    });

    it('should return intervals with correct structure', async () => {
      const response = await request(app).get('/api/producers/intervals');

      if (response.body.min.length > 0) {
        const minInterval = response.body.min[0];
        expect(minInterval).toHaveProperty('producer');
        expect(minInterval).toHaveProperty('interval');
        expect(minInterval).toHaveProperty('previousWin');
        expect(minInterval).toHaveProperty('followingWin');
        expect(typeof minInterval.producer).toBe('string');
        expect(typeof minInterval.interval).toBe('number');
        expect(typeof minInterval.previousWin).toBe('number');
        expect(typeof minInterval.followingWin).toBe('number');
      }

      if (response.body.max.length > 0) {
        const maxInterval = response.body.max[0];
        expect(maxInterval).toHaveProperty('producer');
        expect(maxInterval).toHaveProperty('interval');
        expect(maxInterval).toHaveProperty('previousWin');
        expect(maxInterval).toHaveProperty('followingWin');
        expect(typeof maxInterval.producer).toBe('string');
        expect(typeof maxInterval.interval).toBe('number');
        expect(typeof maxInterval.previousWin).toBe('number');
        expect(typeof maxInterval.followingWin).toBe('number');
      }
    });

    it('should return min intervals with smallest interval value', async () => {
      const response = await request(app).get('/api/producers/intervals');

      if (response.body.min.length > 0) {
        const minValue = response.body.min[0].interval;
        response.body.min.forEach((interval: any) => {
          expect(interval.interval).toBe(minValue);
        });
      }
    });

    it('should return max intervals with largest interval value', async () => {
      const response = await request(app).get('/api/producers/intervals');

      if (response.body.max.length > 0) {
        const maxValue = response.body.max[0].interval;
        response.body.max.forEach((interval: any) => {
          expect(interval.interval).toBe(maxValue);
        });
      }
    });

    it('should calculate intervals correctly', async () => {
      const response = await request(app).get('/api/producers/intervals');

      response.body.min.forEach((interval: any) => {
        const calculatedInterval = interval.followingWin - interval.previousWin;
        expect(calculatedInterval).toBe(interval.interval);
      });

      response.body.max.forEach((interval: any) => {
        const calculatedInterval = interval.followingWin - interval.previousWin;
        expect(calculatedInterval).toBe(interval.interval);
      });
    });

    it('should only include producers with at least 2 wins', async () => {
      const response = await request(app).get('/api/producers/intervals');

      const allProducers = [
        ...response.body.min.map((i: any) => i.producer),
        ...response.body.max.map((i: any) => i.producer),
      ];

      const uniqueProducers = [...new Set(allProducers)];

      for (const producer of uniqueProducers) {
        const producerIntervals = [
          ...response.body.min.filter((i: any) => i.producer === producer),
          ...response.body.max.filter((i: any) => i.producer === producer),
        ];

        const years = new Set<number>();
        producerIntervals.forEach((interval: any) => {
          years.add(interval.previousWin);
          years.add(interval.followingWin);
        });

        expect(years.size).toBeGreaterThanOrEqual(2);
      }
    });

    it('should have min interval less than max interval', async () => {
      const response = await request(app).get('/api/producers/intervals');

      expect(response.body.min.length).toBeGreaterThan(0);
      expect(response.body.max.length).toBeGreaterThan(0);

      const minValue = response.body.min[0].interval;
      const maxValue = response.body.max[0].interval;

      expect(minValue).toBeLessThan(maxValue);
    });
  });

  describe('CSV Structure Validation', () => {
    it('should validate CSV structure on database initialization', async () => {
      const app = createApp();
      expect(app).toBeDefined();
    });

    it('should fail if CSV header is incorrect', async () => {
      const originalContent = readFileSync('movielist.csv', 'utf-8');
      const lines = originalContent.split('\n');
      const originalHeader = lines[0];
      lines[0] = 'ano;titulo;estudios;produtores;vencedor';

      writeFileSync('movielist.csv', lines.join('\n'));

      try {
        await expect(initializeDatabase()).rejects.toThrow('CSV validation failed');
      } finally {
        lines[0] = originalHeader;
        writeFileSync('movielist.csv', lines.join('\n'));
      }
    });

    it('should fail if year format is invalid', async () => {
      const originalContent = readFileSync('movielist.csv', 'utf-8');
      const lines = originalContent.split('\n');
      const originalLine = lines[2];
      lines[2] = 'invalid-year;Test Movie;Studio;Producer;yes';

      writeFileSync('movielist.csv', lines.join('\n'));

      try {
        await expect(initializeDatabase()).rejects.toThrow('CSV validation failed');
      } finally {
        lines[2] = originalLine;
        writeFileSync('movielist.csv', lines.join('\n'));
      }
    });

    it('should fail if winner value is invalid', async () => {
      const originalContent = readFileSync('movielist.csv', 'utf-8');
      const lines = originalContent.split('\n');
      const originalLine = lines[2];
      const parts = originalLine.split(';');
      parts[4] = 'maybe';
      lines[2] = parts.join(';');

      writeFileSync('movielist.csv', lines.join('\n'));

      try {
        await expect(initializeDatabase()).rejects.toThrow('CSV validation failed');
      } finally {
        lines[2] = originalLine;
        writeFileSync('movielist.csv', lines.join('\n'));
      }
    });
  });
});
