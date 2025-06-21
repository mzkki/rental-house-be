import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';

const requestRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { room_id, start_date, end_date, reason, type } = req.body;
    const user = req.user;

    if (!room_id || !start_date || !end_date || !type) {
      res.status(400).json({
        error: true,
        message: 'Room ID, start date, end date, and type are required',
      });
      return;
    }

    const newRequest = await prisma.roomRequest.create({
      data: {
        room_id,
        user_id: user.id,
        start_rent: new Date(start_date),
        end_rent: new Date(end_date),
        reason,
        type,
        status: 'pending',
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

const reviewRoomRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['approved', 'declined'].includes(status)) {
      res.status(400).json({
        error: true,
        message: 'Status must be either "approved" or "declined"',
      });
      return;
    }

    const request = await prisma.roomRequest.findUnique({
      where: { id },
    });

    if (!request) {
      res.status(404).json({
        error: true,
        message: 'Room request not found',
      });
      return;
    }
    if (request.status !== 'pending') {
      res.status(400).json({
        error: true,
        message: 'Room request is not pending',
      });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: request.room_id },
      select: { user_id: true, start_rent: true, end_rent: true },
    });

    if (!room) {
      res.status(404).json({
        error: true,
        message: 'Room not found',
      });
      return;
    }

    const isRented =
      room.user_id !== null &&
      room.start_rent &&
      room.end_rent &&
      request.start_rent <= room.end_rent &&
      request.end_rent >= room.start_rent;

    if (status === 'approved' && isRented) {
      res.status(400).json({
        error: true,
        message: 'Room is already rented out',
      });
      return;
    }

    const updatedRequest = await prisma.roomRequest.update({
      where: { id },
      data: {
        status,
      },
    });

    if (updatedRequest.status === 'approved') {
      await prisma.room.update({
        where: { id: request.room_id },
        data: {
          user_id: updatedRequest.user_id,
          start_rent: updatedRequest.start_rent,
          end_rent: updatedRequest.end_rent,
        },
      });
    }

    res.status(200).json({
      error: false,
      message: 'Room request reviewed successfully',
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

const getRequestLists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await prisma.roomRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            type: {
              select: {
                name: true,
              },
            },
            price: true,
          },
        },
      },
    });
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved room requests',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  requestRoom,
  reviewRoomRequest,
  getRequestLists,
};
