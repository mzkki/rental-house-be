import { Router } from 'express';
import roomController from '../../controllers/RoomController';
import { fileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';
import authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', roomController.getAll);
router.post(
  '/',
  authMiddleware.validateAdmin,
  fileUploadMiddleware,
  roomController.create
);
router.put(
  '/:id',
  authMiddleware.validateAdmin,
  fileUploadMiddleware,
  roomController.update
);
router.delete('/:id', authMiddleware.validateAdmin, roomController.remove);

export default router;
