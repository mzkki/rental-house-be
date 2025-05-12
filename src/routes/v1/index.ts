import { Router } from 'express';
import UserRoutes from './UserRoute';

const router = Router();

router.use('/user', UserRoutes);

export default router;
