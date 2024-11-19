import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import MongoConnection from '../src/utils/mongodb-connection';

beforeAll(() => {
  return MongoConnection.connect();
});

afterAll(() => {
  return mongoose.connection.close();
});
