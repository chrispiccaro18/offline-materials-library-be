import request from 'supertest';
import User from '@/models/User';
import db from '../test-db-setup';
import app from '@/app';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';

const testUserRaw = {
  email: 'testuser@test.com',
  username: 'testuser',
  password: 'testpassword',
};

jest
  .spyOn(bcrypt, 'compare')
  .mockImplementation(
    async (data: string | Buffer, _encrypted: string): Promise<boolean> => {
      if (typeof data !== 'string') {
        throw new Error('Only string passwords are supported in this mock');
      }
      return data === testUserRaw.password;
    }
  );

jest
  .spyOn(bcrypt, 'hash')
  .mockImplementation(
    async (data: string | Buffer, _saltOrRounds: string | number) => {
      if (typeof data !== 'string') {
        throw new Error('Only string passwords are supported in this mock');
      }
      return data;
    }
  );

(generateAccessToken as jest.Mock).mockImplementation(
  () => 'mockedAccessToken'
);
(generateRefreshToken as jest.Mock).mockImplementation(
  () => 'mockedRefreshToken'
);

jest.mock('@/utils/jwt', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

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
  it('return a valid token with correct credentials', async () => {
    await User.create(testUserRaw);

    const response = await request(app).post('/auth/login').send(testUserRaw);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.accessToken).toBe('mockedAccessToken');
  });

  it('return a 401 error for invalid credentials', async () => {
    await User.create(testUserRaw);

    const response = await request(app)
      .post('/auth/login')
      .send({ ...testUserRaw, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'message',
      'Invalid email or password'
    );
  });

  it('return a 400 error if required fields are missing', async () => {
    const responseNoFields = await request(app).post('/auth/login').send({});

    expect(responseNoFields.status).toBe(400);
    expect(responseNoFields.body).toHaveProperty(
      'message',
      'Username and password are required'
    );

    const responseMissingPassword = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser' });

    expect(responseMissingPassword.status).toBe(400);
    expect(responseMissingPassword.body).toHaveProperty(
      'message',
      'Username and password are required'
    );

    const responseMissingUsername = await request(app)
      .post('/auth/login')
      .send({ password: 'somepassword' });

    expect(responseMissingUsername.status).toBe(400);
    expect(responseMissingUsername.body).toHaveProperty(
      'message',
      'Username and password are required'
    );
  });
});
