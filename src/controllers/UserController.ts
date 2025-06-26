import prisma from '../../prisma/prismaClient';
import { NextFunction, Request, Response } from 'express';

const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'admin', // Exclude admin users
        },
      },
    });
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

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.status(200).json({
      error: false,
      message: 'Successfully retrieved user data',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    if (!name || !phone) {
      res.status(400).json({
        error: true,
        message: 'Name and phone are required',
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
      },
    });

    res.status(200).json({
      error: false,
      message: 'Successfully updated user data',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
};
