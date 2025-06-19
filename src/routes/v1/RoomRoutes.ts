import { Router } from 'express';
import roomController from '../../controllers/RoomController';
import { fileUploadMiddleware } from '../../middlewares/fileUploadMiddleware';

const router = Router();

router.get('/', roomController.getAll);
router.post('/', fileUploadMiddleware, roomController.create);
router.put('/:id', fileUploadMiddleware, roomController.update);
router.delete('/:id', roomController.remove);

export default router;
