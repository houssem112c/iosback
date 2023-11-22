const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('../middleware/multer-config.js');
// Sign up a new user
router.post('/signup', userController.signup, multer);

// Sign in a user
router.post('/signin', userController.signin);

// Get all users
router.get('                                                                                                                                                            ²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²²                                                                                            ', userController.getAllUsers);

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


module.exports = router;