import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Activity, { IActivity } from '@/models/Activity';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect Mongoose to the in-memory server
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Close MongoDB connection and stop the in-memory server
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Activity Schema', () => {
  it('should create and save a valid activity', async () => {
    const validActivity: IActivity = new Activity({
      title: 'Paper Airplane Contest',
      materials: ['paper', 'markers'],
      ageRange: 'Preschooler',
      instructions: 'Fold paper into airplanes and see whose flies the farthest!',
      tags: ['indoor', 'crafts'],
      estimatedTime: 15,
    });

    const savedActivity = await validActivity.save();

    // Verify the saved document
    expect(savedActivity._id).toBeDefined();
    expect(savedActivity.title).toBe('Paper Airplane Contest');
    expect(savedActivity.materials).toContain('paper');
    expect(savedActivity.ageRange).toBe('Preschooler');
    expect(savedActivity.estimatedTime).toBe(15);
  });

  it('should fail to save if required fields are missing', async () => {
    const invalidActivity = new Activity({
      materials: ['paper', 'glue'], // Missing title, ageRange, instructions
    });

    // Use Jest's async error assertions
    await expect(invalidActivity.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('should enforce enum validation on ageRange', async () => {
    const invalidActivity = new Activity({
      title: 'Invalid AgeRange Activity',
      materials: ['scissors'],
      ageRange: 'Teenager', // Invalid enum value
      instructions: 'An invalid test case',
      estimatedTime: 10,
    });

    await expect(invalidActivity.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
