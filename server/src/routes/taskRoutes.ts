import express from 'express';
import { createTask, getTasks, getTasksByProject, updateTaskStatus, getTaskById, deleteTask } from '../controllers/taskController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', adminOnly, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.get('/project/:projectId', getTasksByProject);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', adminOnly, deleteTask);

export default router;
