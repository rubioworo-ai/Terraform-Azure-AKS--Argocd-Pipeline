import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/test', (req, res) => res.status(200).json({ message: 'ok' }));

describe('API Integration Tests', () => {
  it('GET /api/test should return 200', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('ok');
  });
});
