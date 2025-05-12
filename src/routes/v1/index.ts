import { Router } from 'express';
import UserRoutes from './UserRoute';
import AuthRoutes from './AuthRoutes';

const router = Router();

router.use('/user', UserRoutes);
router.use('/auth', AuthRoutes);

export default router;
