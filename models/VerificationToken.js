// models/verificationTokenModel.js

const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token will expire in 1 hour (you can adjust this based on your requirements)
  },
});

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);
