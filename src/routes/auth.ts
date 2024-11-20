import express, { Request, Response } from 'express';
import User, { IUser } from '@/models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { asyncWrapper } from '@/utils/asyncWrapper';

const router = express.Router();

router.post(
  '/register',
  asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user: IUser = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  })
);

router.post(
  '/login',
  asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const payload = {
      sub: user.id,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ accessToken });
  })
);

router.post(
  '/refresh',
  asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded);

    res.status(200).json({ accessToken: newAccessToken });
  })
);

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
