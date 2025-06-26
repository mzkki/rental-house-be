import { Router } from 'express';
import userController from '../../controllers/UserController';

const router = Router();

router.get('/', userController.getUsers);
router.get('/me', userController.getUserById);
router.put('/me', userController.updateUser);

export default router;
