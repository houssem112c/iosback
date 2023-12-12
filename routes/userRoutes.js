/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authenticateJWT = require('../middleware/authMiddleware.js');
const userController = require('../controllers/userController');
const multer = require('../middleware/multer-config.js');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               // Add properties for signup route if needed
 *               // Example: username, password, profilePicture, etc.
 *     responses:
 *       200:
 *         description: User signed up successfully
 */
router.post('/signup', userController.signup, multer);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 */
router.post('/signin', userController.signin);

/**
 * @swagger
 * /resetpassword/{id}/{newPassword}:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: newPassword
 *         required: true
 *         schema:
 *           type: string
 *         description: New password
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/resetpassword/:id/:newPassword', userController.resetPassword);

// Other routes with Swagger comments...
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id', userController.findUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             // Add properties for updating a user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}/ban:
 *   put:
 *     summary: Ban a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User banned successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id/ban', userController.banUser);

/**
 * @swagger
 * /users/{id}/unban:
 *   put:
 *     summary: Unban a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id/unban', userController.unBanUser);

/**
 * @swagger
 * /users/{id}/verify:
 *   put:
 *     summary: Verify a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User verified successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id/verify', userController.verifyUser);

/**
 * @swagger
 * /users/{id}/activate:
 *   put:
 *     summary: Activate a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id/activate', userController.activateUser);

/**
 * @swagger
 * /users/{id}/deactivate:
 *   put:
 *     summary: Deactivate a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       404:
 *         description: User not found
    */
    router.put('/users/:id/deactivate', userController.deactivateUser);

// Add Swagger documentation for other routes as needed

/**
 * @swagger
 * /users/{role}:
 *   get:
 *     summary: Get users by role
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: User role
 *     responses:
 *       200:
 *         description: Users found successfully
 *       404:
 *         description: Users not found
 */
router.get('/users/:role', userController.getUsersByRole);

/**
 * @swagger
 * /authenticate-profile:
 *   get:
 *     summary: Authenticate user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile authenticated successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/authenticate-profile', authenticateJWT, userController.authenticateUserProfile);

/**
 * @swagger
 * /{id}/checkpass:
 *   post:
 *     summary: Check user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password check successful
 *       404:
 *         description: User not found
 */
router.post('/:id/checkpass', userController.checkPassword);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', userController.deleteUser);

// Add Swagger documentation for other routes as needed

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/users', userController.getAllUsers);
router.get('/search/:query', userController.searchUsers); // Use :query as a URL parameter
router.get('/export', userController.exportUsers);

router.get('/totalUsersCount', userController.getTotalUsersCount);
router.get('/activeUsersCount', userController.getActiveUsersCount);
router.get('/bannedUsersCount', userController.getBannedUsersCount);
router.get('/verifiedUsersCount', userController.getVerifiedUsersCount);
router.get('/usersCountByRole/:role', userController.getUsersCountByRole);
router.get('/usersWithProfilePictureCount', userController.getUsersWithProfilePictureCount);
//findUserIdByEmail
router.get('/getbyemail/:email', userController.findUserIdByEmail);
module.exports = router;
