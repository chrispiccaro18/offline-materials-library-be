import dotenv from 'dotenv';
dotenv.config();
import MongoConnection from '@/utils/mongodb-connection';
import mongoose from 'mongoose';

describe('MongoDB Connection', () => {
  it('should establish a connection', async () => {
    const db = await MongoConnection.connect();
    expect(db).toBeDefined();
    expect(db.readyState).toBe(1); // 1 = Connected
    mongoose.connection.close();
  });
});
