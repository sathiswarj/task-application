import express from 'express';
import { createProject, getProjects, getProjectById, addMember } from '../controllers/projectController';

const router = express.Router();

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:id/members', addMember);

export default router;
