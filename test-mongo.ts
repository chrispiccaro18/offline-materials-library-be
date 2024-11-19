import MongoConnection from './src/utils/mongodb-connection';

beforeAll(() => {
    process.env.MONGO_URI = 'mongodb://localhost:27017/testdb';
  });

async function test() {
  try {
    await MongoConnection.connect();
    console.log('MongoDB connection successful');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
  }
}

test();
