import { NextFunction, Request, Response } from 'express';

const uploadFiles = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      res.status(400).json({
        error: true,
        message: 'No files uploaded or invalid file format',
      });
      return;
    }

    console.log('files', req.files);

    const fileNames = req.files.map(
      (file: Express.Multer.File) => file.filename
    );

    res.status(200).json({
      error: false,
      message: 'Files uploaded successfully',
      data: fileNames,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFiles,
};
