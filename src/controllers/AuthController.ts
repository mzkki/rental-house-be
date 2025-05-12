import prisma from '../../prisma/prismaClient';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import appConfig from '../config/app';

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ error: true, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      res
        .status(401)
        .json({ error: true, message: 'Invalid email or password' });
    } else {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        appConfig.jwtSecret,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        error: false,
        message: 'Login successful',
        data: {
          user: {
            ...user,
            password: undefined,
          },
          token,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({
        error: true,
        message: 'Name, email, and password are required',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: true, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      error: false,
      message: 'User registered successfully',
      data: {
        ...newUser,
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  register,
};
