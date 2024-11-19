import express, { Request, Response } from 'express';
import User from '../models/User';
import { protectRoute } from '@/middleware/auth';
import { asyncWrapper } from '@/utils/asyncWrapper';

const router = express.Router();

router.get('/profile', protectRoute, asyncWrapper(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
    const user = await User.findById(req.user.id);
    res.status(200).json({ user });
})
);

export default router;