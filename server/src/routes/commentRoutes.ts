import { addComment, getCommentsByTask } from '../controllers/commentController';
import { protect } from '../middleware/auth';
import express from 'express';
const router = express.Router();

router.use(protect);

router.post('/', addComment);
router.get('/task/:taskId', getCommentsByTask);

export default router;
