import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any, // Accepts any error
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.status(err.status || 500).send({ error: err.message || err });
};

export default errorHandler;
