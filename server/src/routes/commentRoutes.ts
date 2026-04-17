import express from 'express';
import { addComment, getCommentsByTask } from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', addComment);
router.get('/task/:taskId', getCommentsByTask);

export default router;
