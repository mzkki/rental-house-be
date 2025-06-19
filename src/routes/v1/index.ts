import { Router } from 'express';
import UserRoutes from './UserRoute';
import AuthRoutes from './AuthRoutes';
import RoomTypeRoutes from './RoomTypeRoutes';
import validateToken from '../../middlewares/authMiddleware';

const router = Router();

router.use('/users', validateToken, UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/room-types', validateToken, RoomTypeRoutes);

export default router;
