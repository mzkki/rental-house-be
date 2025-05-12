import prisma from '../../prisma/prismaClient';
import { NextFunction, Request, Response } from 'express';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    const response = {
      error: false,
      message: 'Successfully get all users data',
      data: users,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
