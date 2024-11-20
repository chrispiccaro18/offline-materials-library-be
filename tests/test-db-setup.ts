import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';

jest.spyOn(bcrypt, 'hash').mockImplementation(async (data: string | Buffer, _saltOrRounds: string | number) => {
  if (typeof data !== 'string') {
    throw new Error('Only string passwords are supported in this mock');
  }
  return `hashed-${data}`;
});

(generateAccessToken as jest.Mock).mockImplementation(() => 'mockedAccessToken');
(generateRefreshToken as jest.Mock).mockImplementation(() => 'mockedRefreshToken');

jest.mock('@/utils/jwt', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

let mongoServer: MongoMemoryServer;

const connect = async (): Promise<void> => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const disconnect = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clearDatabase = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export default { connect, disconnect, clearDatabase };
