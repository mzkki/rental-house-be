import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app';

declare module 'express-serve-static-core' {
  interface Request {
    user: UserData;
  }

  interface UserData {
    id: string;
    email: string;
    role: string;
  }
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak ditemukan' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, appConfig.jwtSecret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res
          .status(401)
          .json({ error: true, message: 'Token telah kedaluwarsa' });
      } else {
        res.status(401).json({ error: true, message: 'Token tidak valid' });
      }
      return;
    } else if (decoded && typeof decoded !== 'string') {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } else {
      res.status(401).json({ error: true, message: 'Token tidak valid' });
      return;
    }
  });
};

const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    res.status(403).json({
      error: true,
      message: 'Akses ditolak. Hanya admin yang dapat mengakses fitur ini.',
    });
    return;
  }
  next();
};

export default { validateToken, validateAdmin };
