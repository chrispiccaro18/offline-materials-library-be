import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || '';
const JWT_EXPIRATION = '1h'; // token expires in 1 hour

export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (token: string): string | JwtPayload => {
    return jwt.verify(token, JWT_SECRET);
};