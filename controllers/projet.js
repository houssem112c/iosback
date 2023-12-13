const lesson = require("../models/projet");
const sydFunctions = require('../utils/syd-functions');

const ObjectId = require("mongodb").ObjectId;


exports.addlesson = (req, res) => {
  let newlesson = new lesson({ ...req.body, imageRes: req.file.filename });

  newlesson.save((erro, newlesson) => {
    if (erro) {
      return res.status(400).json({
        error: "unable to add lesson",
      });
    }
    return res.json({
      message: "sucsess",
      newlesson,
    });
  });
  console.log(newlesson);
};
exports.allLesson = async (req, res) => {
  try {
    const les = await lesson.find()
    res.json(les)

  } catch (error) {
    res.status(500).json(error)
  }
}
exports.deletelesson = async (req, res, next) => {
  const LessonId = req.params.lessonId;
  try {
      const Lesson = await lesson.findById(LessonId);
      if (!Lesson) {
          return res.status(404).json({ message: 'lesson not found!' });
      }

      await lesson.findByIdAndRemove(LessonId);
      res.status(200).json({ 'message': 'Deletion completed successfully!' });

  } catch (error) {
      console.log('error', error);
      res.status(500).json({ message: 'Delete failed!' });
  }
};
