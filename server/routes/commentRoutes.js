const express = require('express');
const router = express.Router();
const { addComment, getCommentsByTask } = require('../controllers/commentController');

router.post('/', addComment);
router.get('/task/:taskId', getCommentsByTask);

module.exports = router;
