import { Router } from 'express';
import roomRequestController from '../../controllers/RoomRequestController';
import authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', roomRequestController.getRequestLists);
router.get('/me', roomRequestController.getMyRequests);
router.post('/', roomRequestController.requestRoom);
router.put(
  '/:id',
  authMiddleware.validateAdmin,
  roomRequestController.reviewRoomRequest
);

export default router;
