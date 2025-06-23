import { Router } from 'express';
import complaintController from '../../controllers/ComplaintController';

const router = Router();

router.get('/', complaintController.getAllComplaints);
router.get('/me', complaintController.getMyComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', complaintController.storeComplaint);
router.post('/:id/replies', complaintController.addComplaintReply);
router.delete('/:id', complaintController.deleteComplaint);
router.delete('/replies/:replyId', complaintController.deleteComplaintReply);

export default router;
