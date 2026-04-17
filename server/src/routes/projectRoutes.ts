import express from 'express';
import { createProject, getProjects, getProjectById, addMember } from '../controllers/projectController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/', adminOnly, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:id/members', adminOnly, addMember);

export default router;
