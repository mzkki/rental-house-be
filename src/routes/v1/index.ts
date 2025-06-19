import { Router } from 'express';
import UserRoutes from './UserRoute';
import AuthRoutes from './AuthRoutes';
import validateToken from '../../middlewares/authMiddleware';
import RoomTypeRoutes from './RoomTypeRoutes';
import RoomRoutes from './RoomRoutes';

const router = Router();

router.use('/users', validateToken, UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/room-types', validateToken, RoomTypeRoutes);
router.use('/rooms', validateToken, RoomRoutes);

export default router;
