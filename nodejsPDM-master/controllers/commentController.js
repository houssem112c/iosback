const Comment = require('../models/commentModel');
const User = require('../models/userModel');

const createComment = async (req, res) => {
  const { lessonId, text } = req.body;

  try {

    const comment = new Comment({ lessonId, text });
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCommentsByLessonId = async (req, res) => {
  const lessonId = req.params.lessonId;

  try {
    const comments = await Comment.find({ lessonId });
    res.json(comments);
  } catch (error) {
    console.error(`Error fetching comments for lesson ID ${lessonId}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComment,
  getCommentsByLessonId,
};
