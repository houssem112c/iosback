const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({

  imageRes: {
    type: String,
    required: false,
  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },



});

module.exports = mongoose.model("lesson", lessonSchema);
