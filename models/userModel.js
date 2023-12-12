const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  dateofbirth: {
    type: Date,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ['Contributeur', 'Organisateur', 'Admin']
  },
  profilepicture: {
    type: String,
    required: false
  },
  profilebio: {
    type: String,
    required: false,
    maxlength: 100,
  },
  location: {
    type: String,
    required: false
  },
  facebooklink: {
    type: String,
    required: false,
    maxlength: 255,
  },
  instagramlink: {
    type: String,
    required: false,
    maxlength: 255,
  },
  linkedinlink: {
    type: String,
    required: false,
    maxlength: 255,
  },
  phonenumber: {
    type: Number,
    required: false,
    optional: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', UserSchema);
