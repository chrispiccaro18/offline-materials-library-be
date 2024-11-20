import bcrypt from 'bcrypt';
import User from '@/models/User';
import db from '../test-db-setup';

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.disconnect();
});

const plainPassword = 'testpassword';

const testUserRaw = {
  username: 'testuser',
  email: 'testemail@test.com',
  password: plainPassword,
};

const secondTestUserRaw = {
  username: 'secondTestUser',
  email: 'secondetestemail@test.com',
  password: plainPassword,
};

describe('Password hashing', () => {
  it('should hash the password securely before saving', async () => {
    const user = new User(testUserRaw);
    await user.save();

    const savedUser = await User.findOne({ username: testUserRaw.username });

    expect(savedUser?.password).not.toBe(plainPassword);

    const isMatch = await bcrypt.compare(
      plainPassword,
      savedUser?.password || ''
    );
    expect(isMatch).toBe(true);
  });

  it('should produce different hashes for the same password (salting)', async () => {
    const user1 = new User(testUserRaw);
    const user2 = new User(secondTestUserRaw);
    await user1.save();
    await user2.save();

    const savedUser1 = await User.findOne({ username: testUserRaw.username });
    const savedUser2 = await User.findOne({
      username: secondTestUserRaw.username,
    });

    // ensure the hashes are different
    expect(savedUser1?.password).not.toBe(savedUser2?.password);
  });
});
