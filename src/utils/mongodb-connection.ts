import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not defined');
}

// Create a singleton class for MongoDB connection
class MongoConnection {
  private static instance: MongoConnection;
  private connection: mongoose.Connection | null = null;

  private constructor() {} // Prevent instantiation

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<mongoose.Connection> {
    if (this.connection) {
      return this.connection;
    }

    try {
      const mongooseInstance = await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected');
      this.connection = mongooseInstance.connection;
      return this.connection;
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    }
  }
}

export default MongoConnection.getInstance();
