const express = require("express");
const multer = require("../middleware/multer-config");

const lessonController = require("../controllers/projet");

const router = express.Router();

const commentController = require('../controllers/commentController');

router.post('/comments', commentController.addComment);
router.get('/comments/:lessonId', commentController.getCommentsByLessonId);
router.put('/comments/:commentId/report', commentController.reportComment);

router.post("/addlesson", multer, lessonController.addlesson);

router.get("/allLesson", lessonController.allLesson);

router.delete("/lessons/:lessonId", lessonController.deletelesson);


module.exports = router;
