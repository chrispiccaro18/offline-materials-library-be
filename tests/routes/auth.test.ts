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
      return `hashed-${data}`;
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
    expect(response.body).toHaveProperty('accessToken', 'mockedAccessToken');
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
      .send({ username: testUserRaw.username });

    expect(responseMissingPassword.status).toBe(400);
    expect(responseMissingPassword.body).toHaveProperty(
      'message',
      'Username and password are required'
    );

    const responseMissingUsername = await request(app)
      .post('/auth/login')
      .send({ password: testUserRaw.password });

    expect(responseMissingUsername.status).toBe(400);
    expect(responseMissingUsername.body).toHaveProperty(
      'message',
      'Username and password are required'
    );
  });
});

describe('POST /register', () => {
  it('should create a new user and return a success response with an access token', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUserRaw);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken', 'mockedAccessToken');

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/refreshToken=.*; HttpOnly; SameSite=Strict/);

    const newUser = await User.findOne({ username: testUserRaw.username });
    expect(newUser).not.toBeNull();
    expect(newUser?.email).toBe(testUserRaw.email);

    expect(newUser?.password).not.toBe(testUserRaw.password);
  });

  it('should return a 400 error if required fields are missing', async () => {
    const responseNoFields = await request(app).post('/auth/register').send({});
    expect(responseNoFields.status).toBe(400);
    expect(responseNoFields.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingEmailPassword = await request(app)
      .post('/auth/register')
      .send({ username: testUserRaw.username });
    expect(responseMissingEmailPassword.status).toBe(400);
    expect(responseMissingEmailPassword.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingUsernamePassword = await request(app)
      .post('/auth/register')
      .send({ email: testUserRaw.email });
    expect(responseMissingUsernamePassword.status).toBe(400);
    expect(responseMissingUsernamePassword.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingUsernameEmail = await request(app)
      .post('/auth/register')
      .send({ password: testUserRaw.password });
    expect(responseMissingUsernameEmail.status).toBe(400);
    expect(responseMissingUsernameEmail.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingUsername = await request(app)
      .post('/auth/register')
      .send({ password: testUserRaw.password, email: testUserRaw.email });
    expect(responseMissingUsername.status).toBe(400);
    expect(responseMissingUsername.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingEmail = await request(app)
      .post('/auth/register')
      .send({ username: testUserRaw.username, password: testUserRaw.password });
    expect(responseMissingEmail.status).toBe(400);
    expect(responseMissingEmail.body).toHaveProperty(
      'message',
      'All fields are required'
    );

    const responseMissingPassword = await request(app)
      .post('/auth/register')
      .send({ username: testUserRaw.username, email: testUserRaw.email });
    expect(responseMissingPassword.status).toBe(400);
    expect(responseMissingPassword.body).toHaveProperty(
      'message',
      'All fields are required'
    );
  });

  it('should return a 409 error if the username is already taken', async () => {
    await User.create(testUserRaw);

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: testUserRaw.username,
        email: 'newemail@example.com',
        password: 'anotherPassword123',
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'Username already taken');
  });

  it('should return a 409 error if the email is already taken', async () => {
    await User.create(testUserRaw);

    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'newUser',
        email: testUserRaw.email,
        password: 'anotherPassword123',
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'Email already taken');
  });
});
