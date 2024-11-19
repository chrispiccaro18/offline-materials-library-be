import request from 'supertest';
import express from 'express';
import authRoutes from '@/routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
  });
});
