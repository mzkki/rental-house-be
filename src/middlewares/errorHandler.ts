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

  res.status(500).json({ error: message });
};

export const notFoundHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({ error: 'Tidak Ditemukan' });
};
