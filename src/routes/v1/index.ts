import { Router } from 'express';
import UserRoutes from './UserRoute';
import AuthRoutes from './AuthRoutes';
import authMiddlewares from '../../middlewares/authMiddleware';
import RoomTypeRoutes from './RoomTypeRoutes';
import RoomRoutes from './RoomRoutes';
import fileUploadRoutes from './FileUploadRoutes';
import RoomRequestRoutes from './RoomRequestRoutes';

const router = Router();

router.use('/users', authMiddlewares.validateToken, UserRoutes);
router.use('/auth', AuthRoutes);
router.use('/room-types', authMiddlewares.validateToken, RoomTypeRoutes);
router.use('/rooms', authMiddlewares.validateToken, RoomRoutes);
router.use('/file-uploads', authMiddlewares.validateToken, fileUploadRoutes);
router.use('/room-requests', authMiddlewares.validateToken, RoomRequestRoutes);

export default router;
