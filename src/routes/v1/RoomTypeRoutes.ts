import { Router } from 'express';
import roomTypeController from '../../controllers/RoomTypeController';

const router = Router();

router.get('/', roomTypeController.getAll);
router.post('/', roomTypeController.create);
router.put('/:id', roomTypeController.update);
router.delete('/:id', roomTypeController.deleteById);

export default router;
