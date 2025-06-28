import { NextFunction, Request, Response } from 'express';
import prisma from '../../prisma/prismaClient';

const getAllComplaints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved all complaints',
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.findUnique({
      where: { id: id },
      include: {
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!complaint) {
      res.status(404).json({
        error: true,
        message: 'Complaint not found',
      });
      return;
    }

    res.status(200).json({
      error: false,
      message: 'Successfully retrieved complaint',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const storeComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reason, room_id } = req.body;
    const userId = req.user.id;

    if (!reason || !room_id) {
      res.status(400).json({
        error: true,
        message: 'Reason and room ID are required',
      });
      return;
    }

    const room = await prisma.room.findUnique({
      where: { id: room_id },
    });

    if (!room) {
      res.status(404).json({
        error: true,
        message: 'Room not found',
      });
      return;
    }

    const newComplaint = await prisma.complaint.create({
      data: {
        reason,
        room_id,
        user_id: userId,
      },
    });

    res.status(201).json({
      error: false,
      message: 'Complaint created successfully',
      data: newComplaint,
    });
  } catch (error) {
    next(error);
  }
};

const addComplaintReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !id) {
      res.status(400).json({
        error: true,
        message: 'Message and complaint ID are required',
      });
      return;
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: id },
    });

    if (!complaint) {
      res.status(404).json({
        error: true,
        message: 'Complaint not found',
      });
      return;
    }

    const newReply = await prisma.reply.create({
      data: {
        complaint_id: id,
        message,
        user_id: userId,
      },
    });

    res.status(201).json({
      error: false,
      message: 'Reply added successfully',
      data: newReply,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id: id },
      include: {
        replies: true,
      },
    });

    if (!complaint) {
      res.status(404).json({
        error: true,
        message: 'Complaint not found',
      });
      return;
    }

    await prisma.reply.deleteMany({
      where: { complaint_id: id },
    });

    await prisma.complaint.delete({
      where: { id: id },
    });

    res.status(200).json({
      error: false,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteComplaintReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { replyId } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      res.status(404).json({
        error: true,
        message: 'Reply not found',
      });
      return;
    }

    await prisma.reply.delete({
      where: { id: replyId },
    });

    res.status(200).json({
      error: false,
      message: 'Reply deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const complaints = await prisma.complaint.findMany({
      where: { user_id: userId },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.status(200).json({
      error: false,
      message: 'Successfully retrieved my complaints',
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllComplaints,
  getComplaintById,
  storeComplaint,
  addComplaintReply,
  deleteComplaint,
  deleteComplaintReply,
  getMyComplaints,
};
