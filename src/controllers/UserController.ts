import prisma from '../../prisma/prismaClient'; // Adjust the import based on your project structure
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const response = {
      message: 'Successfully get all users data',
      data: users,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
