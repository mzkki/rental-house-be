/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response, Request } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err.stack);
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(500).json({ error: true, message });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

export const authenticationErrorHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication failed',
  });
};
