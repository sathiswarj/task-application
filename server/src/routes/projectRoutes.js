const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addMember } = require('../controllers/projectController');

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/:id/members', addMember);

module.exports = router;
