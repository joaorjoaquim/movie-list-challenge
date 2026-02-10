import request from 'supertest';
import { createApp } from '../../src/app';
import { initializeDatabase } from '../../src/config/database';

describe('Health Check API', () => {
  let app: any;

  beforeAll(async () => {
    await initializeDatabase();
    app = createApp();
  });

  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });
});
