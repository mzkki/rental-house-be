import { Router } from 'express';
import UserRoutes from './UserRoute';
import AuthRoutes from './AuthRoutes';
import RoomTypeRoutes from './RoomTypeRoutes';

const router = Router();

router.use('/users', UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/room-types', RoomTypeRoutes);

export default router;
