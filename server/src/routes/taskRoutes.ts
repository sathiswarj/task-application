import express from 'express';
import { createTask, getTasks, getTasksByProject, updateTaskStatus } from '../controllers/taskController';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/project/:projectId', getTasksByProject);
router.patch('/:id/status', updateTaskStatus);

export default router;
