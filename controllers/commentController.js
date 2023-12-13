const Comment = require('../models/commentModel');
const sydFunctions = require('../utils/syd-functions');

const ObjectId = require("mongodb").ObjectId;
exports.addComment = async (req, res) => {
  try {
    const { lessonId, text } = req.body;
    
    const newComment = new Comment({ lessonId, text });
    const savedComment = await newComment.save();

    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCommentsByLessonId = async (req, res) => {
    try {
      const { lessonId } = req.params;
      
      const comments = await Comment.find({ lessonId });
  
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.reportComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      // Find the comment by ID
      const comment = await Comment.findById(commentId);
  
      // Check if the comment exists
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Check if the comment has already been reported
      if (comment.reported) {
        return res.status(400).json({ error: 'Comment already reported' });
      }
  
      // Update the reported field in the comment document
      comment.reported = true;
      await comment.save();
  
      res.status(200).json({ message: 'Comment reported successfully' });
    } catch (error) {
      console.error('Error reporting comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };