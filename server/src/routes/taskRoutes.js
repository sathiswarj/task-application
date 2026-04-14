const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTaskStatus, addAttachment } = require('../controllers/taskController');

router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.patch('/:id/status', updateTaskStatus);
router.post('/:id/attachments', addAttachment);

module.exports = router;
