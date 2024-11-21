import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { asyncWrapper } from '@/utils/asyncWrapper';

// TODO: make sure that accessToken matches the user
export const protectRoute = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized: No token provided' });
      return;
    }

    const decodedPayload = verifyAccessToken(token);
    req.jwtPayload = decodedPayload; // Attach decoded userId to the request object
    next();
  }
);
