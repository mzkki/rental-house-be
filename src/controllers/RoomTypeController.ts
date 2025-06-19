import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';

const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roomTypes = await prisma.roomType.findMany();
    const response = {
      error: false,
      message: 'Successfully retrieved all room types',
      data: roomTypes,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, specification } = req.body;

    if (!name || !specification) {
      res.status(400).json({
        error: true,
        message: 'Name, and specification are required',
      });
      return;
    }

    const newRoomType = await prisma.roomType.create({
      data: {
        name,
        specification,
      },
    });

    const response = {
      error: false,
      message: 'Successfully created room type',
      data: newRoomType,
    };
    res.status(201).json(response);
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
    const { name, specification } = req.body;

    if (!name || !specification) {
      res.status(400).json({
        error: true,
        message: 'Name, and specification are required',
      });
      return;
    }

    const updatedRoomType = await prisma.roomType.update({
      where: { id: id },
      data: {
        name,
        specification,
      },
    });

    const response = {
      error: false,
      message: 'Successfully updated room type',
      data: updatedRoomType,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedRoomType = await prisma.roomType.delete({
      where: { id: id },
    });

    const response = {
      error: false,
      message: 'Successfully deleted room type',
      data: deletedRoomType,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  create,
  update,
  deleteById,
};
