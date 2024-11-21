import express, { Request, Response } from 'express';
import User from '../models/User';
import { asyncWrapper } from '@/utils/asyncWrapper';

const router = express.Router();

router.get(
  '/profile',
  asyncWrapper(async (req: Request, res: Response) => {
    res.status(200).json({ message: 'hello world!' });
  })
);

export default router;
