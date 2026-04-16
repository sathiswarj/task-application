import express from 'express';
import { addComment, getCommentsByTask } from '../controllers/commentController';

const router = express.Router();

router.post('/', addComment);
router.get('/task/:taskId', getCommentsByTask);

export default router;
