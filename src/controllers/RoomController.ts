import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';
import fs from 'fs';
import path from 'path';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type_id } = req.query;
    const rooms = await prisma.room.findMany({
      where: {
        ...(type_id && { type_id: String(type_id) }),
      },
      include: {
        type: {
          select: {
            id: true,
            name: true,
            specification: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      omit: {
        type_id: true,
      },
    });

    const usedRoom = rooms.filter((room) => {
      return room.start_rent && room.end_rent
        ? new Date(room.start_rent) <= new Date() &&
            new Date(room.end_rent) >= new Date()
        : false;
    });

    const availableRoom = rooms.filter((room) => {
      return !(room.start_rent && room.end_rent
        ? new Date(room.start_rent) <= new Date() &&
          new Date(room.end_rent) >= new Date()
        : false);
    });

    const formattedRooms = rooms.map((room) => {
      return {
        ...room,
        pictures: room.pictures
          ? JSON.parse(room.pictures).map((picture: any) => ({
              filename: picture,
              url: process.env.BE_URL + '/uploads/' + picture,
            }))
          : [],
        isRented:
          room.start_rent && room.end_rent
            ? new Date(room.start_rent) <= new Date() &&
              new Date(room.end_rent) >= new Date()
            : false,
      };
    });
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved all rooms',
      data: {
        rooms: formattedRooms,
        usedRoom: usedRoom.length,
        availableRoom: availableRoom.length,
        totalRooms: formattedRooms.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        type: {
          select: {
            id: true,
            name: true,
            specification: true,
            facilities: true,
          },
        },
      },
    });
    if (!room) {
      res.status(404).json({
        error: true,
        message: 'Room not found',
      });
      return;
    }

    const formattedRoom = {
      ...room,
      pictures: room.pictures
        ? JSON.parse(room.pictures).map((picture: any) => ({
            filename: picture,
            url: process.env.BE_URL + '/uploads/' + picture,
          }))
        : [],
      isRented:
        room.start_rent && room.end_rent
          ? new Date(room.start_rent) <= new Date() &&
            new Date(room.end_rent) >= new Date()
          : false,
    };
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved room',
      data: formattedRoom,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type_id, price, files, address, description } = req.body;

    if (!name || !type_id || !price || isNaN(Number(price))) {
      res.status(400).json({
        error: true,
        message:
          'Name, type_id, and price are required and price must be a number',
      });
      return;
    }

    const newRoom = await prisma.room
      .create({
        data: {
          name,
          type_id,
          price: Number(price),
          pictures: JSON.stringify(files) || null,
          address: address || null,
          description: description || null,
        },
      })
      .catch((error) => {
        if (error.code === 'P2003') {
          res.status(400).json({
            error: true,
            message: 'Invalid type_id provided',
          });
          return;
        }
      });

    if (!newRoom) {
      return;
    }

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
    const { name, type_id, price, files, address, description } = req.body;

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

    if (files && currentRoom.pictures) {
      const oldPictures = JSON.parse(currentRoom.pictures);
      const newPictures = files;

      oldPictures.forEach((picture: string) => {
        if (!newPictures.includes(picture)) {
          const oldFilePath = path.join(
            __dirname,
            process.env.APP_ENV != 'production'
              ? '../../uploads'
              : '../uploads',
            picture
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        name,
        type_id,
        price: Number(price),
        pictures: files ? JSON.stringify(files) : currentRoom.pictures,
        address: address || null,
        description: description || null,
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
      const pictures = JSON.parse(currentRoom.pictures || '[]');
      pictures.forEach((picture: string) => {
        const filePath = path.join(
          __dirname,
          process.env.APP_ENV != 'production' ? '../../uploads' : '../uploads',
          picture
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
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
  getRoomById,
  create,
  update,
  remove,
};
