import { Router } from 'express';
import fileUploadController from '../../controllers/FileUploadController';
import { fileUploadMiddlewareMultiple } from '../../middlewares/fileUploadMiddleware';

const router = Router();

router.post(
  '/',
  fileUploadMiddlewareMultiple,
  fileUploadController.uploadFiles
);

export default router;
