/* eslint-disable no-console */
import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import MongoConnection from './utils/mongodb-connection';

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await MongoConnection.connect();
    console.log(`Server is running on ${PORT}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB on startup:', err);
  }
});
