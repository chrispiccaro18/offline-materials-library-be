import request from 'supertest';
import User from '@/models/User';
import db from '../test-db-setup';
import app from '@/app';

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  jest.clearAllMocks();
  await db.clearDatabase();
});

afterAll(async () => {
  await db.disconnect();
});

describe('POST /login', () => {
  it('should return a valid token with correct credentials', async () => {
    const testUserRaw = {
      email: 'testuser@test.com',
      username: 'testuser',
      password: 'testpassword'
    };
    
    await User.create(testUserRaw);

    const response = await request(app)
      .post('/auth/login')
      .send(testUserRaw);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.accessToken).toBe('mockedAccessToken');
  });
});
