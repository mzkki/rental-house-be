import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';
import fs from 'fs';
import path from 'path';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rooms = await prisma.room.findMany();
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved all rooms',
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve rooms : ' + error,
    });
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type_id, price } = req.body;
    const picture = req.file?.filename;

    if (!name || !type_id || !price || isNaN(Number(price))) {
      res.status(400).json({
        error: true,
        message:
          'Name, type_id, and price are required and price must be a number',
      });
      return;
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        type_id,
        price: Number(price),
        pictures: picture || null,
      },
    });

    res.status(201).json({
      error: false,
      message: 'Successfully created room',
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type_id, price } = req.body;
    const picture = req.file?.filename;

    if (!name || !type_id || !price || isNaN(Number(price))) {
      res.status(400).json({
        error: true,
        message:
          'Name, type_id, and price are required and price must be a number',
      });
      return;
    }

    const currentRoom = await prisma.room.findUnique({
      where: { id },
      select: { pictures: true },
    });

    if (!currentRoom) {
      res.status(404).json({
        error: true,
        message: 'Room not found',
      });
      return;
    }

    if (picture && currentRoom?.pictures) {
      const oldFilePath = path.join(
        __dirname,
        '../../uploads',
        currentRoom.pictures
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        name,
        type_id,
        price: Number(price),
        pictures: picture || currentRoom?.pictures || null,
      },
    });

    res.status(200).json({
      error: false,
      message: 'Successfully updated room',
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const currentRoom = await prisma.room.findUnique({
      where: { id },
      select: { pictures: true },
    });

    if (!currentRoom) {
      res.status(404).json({
        error: true,
        message: 'Room not found',
      });
      return;
    }

    if (currentRoom.pictures) {
      const filePath = path.join(
        __dirname,
        '../../uploads',
        currentRoom.pictures
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.room.delete({
      where: { id },
    });

    res.status(200).json({
      error: false,
      message: 'Successfully deleted room',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  create,
  update,
  remove,
};
