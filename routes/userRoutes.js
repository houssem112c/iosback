const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authenticateJWT = require ('../middleware/authMiddleware.js');
const userController = require('../controllers/userController');
const multer = require('../middleware/multer-config.js');
// Sign up a new user
//const multer = require('multer');
/*const uploadMiddleware = multer({
  dest: 'uploads/' // Set the destination directory for uploaded files
});*/
router.post('/signup', userController.signup, multer);

// Sign in a user
router.post('/signin', userController.signin);
//uploadrandomprofilepicture
//router.post('/genprofilepicture', userController.uploadrandomprofilepicture, uploadMiddleware.single('profilePicture'));
router.post('/resetpassword/:id/:newPassword', userController.resetPassword);

// Get all users

// Find a user by ID
router.get('/users/:id', userController.findUserById);

// Update a user
router.put('/users/:id', userController.updateUser);

// Ban a user
router.put('/users/:id/ban', userController.banUser);

// Unban a user
router.put('/users/:id/unban', userController.unBanUser);

// Verify a user
router.put('/users/:id/verify', userController.verifyUser);

// Activate a user
router.put('/users/:id/activate', userController.activateUser);

// Deactivate a user
router.put('/users/:id/deactivate', userController.deactivateUser);

// Get users by role
router.get('/users/:role', userController.getUsersByRole);

router.get('/authenticate-profile', authenticateJWT, userController.authenticateUserProfile);


router.post('/:id/checkpass', userController.checkPassword);
router.delete('/users/:id', userController.deleteUser);
module.exports = router;