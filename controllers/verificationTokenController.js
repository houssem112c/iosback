// controllers/verificationTokenController.js

const VerificationToken = require('../models/verificationToken');
const User = require('../models/userModel');
const crypto = require('crypto');

// Function to generate a random 4-digit pin code
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to generate a verification token
async function generateVerificationToken(userId) {
  try {
    const existingToken = await VerificationToken.findOne({ userId });
    if (existingToken) {
      return existingToken.token;
    }

    const token = generatePin();
    const verificationToken = new VerificationToken({
      userId,
      token,
    });

    await verificationToken.save();

    return token;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw error;
  }
}

// Function to verify the pin code and update user's isVerified status
async function verifyUser(userId, pin) {
  try {
    const verificationToken = await VerificationToken.findOne({ userId, token: pin });

    if (!verificationToken) {
      return false; // Pin code does not match
    }

    // Update user's isVerified status
    await User.findByIdAndUpdate(userId, { isVerified: true });

    // Remove the verification token from the collection
    await VerificationToken.findOneAndDelete({ userId, token: pin });

    return true; // Verification successful
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
}

module.exports = {
  generateVerificationToken,
  verifyUser,
};
