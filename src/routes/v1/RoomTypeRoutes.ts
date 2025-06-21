import { Router } from 'express';
import roomTypeController from '../../controllers/RoomTypeController';
import authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', roomTypeController.getAll);
router.post('/', authMiddleware.validateAdmin, roomTypeController.create);
router.put('/:id', authMiddleware.validateAdmin, roomTypeController.update);
router.delete(
  '/:id',
  authMiddleware.validateAdmin,
  roomTypeController.deleteById
);

export default router;
