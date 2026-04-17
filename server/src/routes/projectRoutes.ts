import express from 'express';
import { createProject, getProjects, getProjectById, addMember } from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:id/members', addMember);

export default router;
