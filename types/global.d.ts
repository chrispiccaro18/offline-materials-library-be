import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }
}

// This is required to make the file a module and avoid duplicate identifiers error
export {};
