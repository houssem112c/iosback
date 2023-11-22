const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateJWT = require('../middleware/authMiddleware');

// Route for creating a new comment
router.post('/',  commentController.createComment);

// Route for fetching comments by lesson ID
router.get('/:lessonId', commentController.getCommentsByLessonId);

// Ensure user is authenticated (adjust this based on your authentication setup)

module.exports = router;
