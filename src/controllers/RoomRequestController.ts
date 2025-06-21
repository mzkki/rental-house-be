import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';

const requestRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { room_id, user_id, start_date, end_date } = req.body;

    if (!room_id || !user_id || !start_date || !end_date) {
      res.status(400).json({
        error: true,
        message: 'Room ID, User ID, start date, and end date are required',
      });
      return;
    }

    const newRequest = await prisma.roomRequest.create({
      data: {
        room_id,
        user_id,
        start_rent: new Date(start_date),
        end_rent: new Date(end_date),
      },
    });

    res.status(201).json({
      error: false,
      message: 'Room request created successfully',
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};
