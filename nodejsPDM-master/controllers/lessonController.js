const lesson = require('../models/lesson');
const sydFunctions = require('../utils/syd-functions');

exports.getAlllessons = async (req, res, next) => {
    try {
        const list = await lesson.find(); // Use "Lesson" instead of "lesson"
        res.status(200).json({ message: "List of lessons", list: list });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Recovery failed!' });
    }
};

exports.getSinglelessons = async (req, res, next) => {
    const lessonId = req.params.lessonId;
    try {
        const lesson = await Lesson.findById(lessonId); 
        if (!lesson) {
            return res.status(404).json({ message: 'lesson not found!' });
        }
        res.status(200).json({ message: "Retrieved lesson", lesson: lesson });
    } catch (error) {
        console.log('error', error);
        res.status(500).json({ message: 'Recovery failed!' });
    }

};

exports.addlesson = async (req, res, next) => {
    const errorMessage = sydFunctions.validators(req, res);
    console.log('Retrieved errorMessage', errorMessage);
    if (errorMessage) {
        return res.status(422).json({ message: 'Validation error', error: errorMessage });
    }
    

    const Lesson = new lesson({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const result = await Lesson.save()
        console.log('result', result);
        return res.status(201).json({
            message: "lesson is successfully added!",
            lesson: result
        });
    } catch (error) {
        console.log('error', error);
       
        res.status(500).json({ message: 'Creation failed!' });
    }
};

exports.updatelesson = async (req, res, next) => {
    const errorMessage = sydFunctions.validators(req, res);
    console.log('Retrieved errorMessage', errorMessage);
    if (errorMessage) {
        return res.status(422).json({ message: 'Validation failed!', error: errorMessage });
    }

   

    const lessonId = req.params.lessonId;
    try {
        const lesson = await lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'lesson not found!' });
        }
        if (photoUrl !== lesson.photoUrl) {
            sydFunctions.deleteImage(lesson.photoUrl);
        }
        lesson.name = req.body.name;
        lesson.description = req.body.description;
                const result = await lesson.save();
        res.status(200).json({ 'message': 'Modification successfully completed!', lesson: result });

    } catch (error) {
        console.log('error', error);
       
        res.status(500).json({ message: 'Update failed!' });
    }

};

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

exports.toggleFavoriteStatus = async (req, res) => {
    const { lessonId } = req.params;

    try {
        const favorite = await lesson.findById(lessonId);

        if (!favorite) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        favorite.isFavorite = !favorite.isFavorite;

        await favorite.save();

        return res.json({ message: 'Favorite status updated successfully', favorite });
    } catch (error) {
        console.error('Error toggling favorite status:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.fetchAllLikedLessons = async (req, res, next) => {
    try {
        const likedLessons = await lesson.find({ isFavorite: true });
        res.status(200).json({ message: "List of liked lessons", list: likedLessons });
    } catch (error) {
        console.error('Error fetching all liked lessons:', error);
        res.status(500).json({ message: 'Fetching liked lessons failed!' });
    }
};