import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach decoded user to the request object
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
