const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema(
    {
        name: { type: String },
        description: { type: String },
        isFavorite: { type: Boolean, default: false },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('lesson', lessonSchema);
