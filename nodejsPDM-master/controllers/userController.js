// controllers/user.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'public/images' });


// Create a transporter with your email service provider's SMTP configuration


// Sign up a new user
async function signup(req, res) {
  // Hash the password
  console.log("Fullname before hashing:", req.body.fullname);
  console.log("Email before hashing:", req.body.email);
  console.log("Password before hashing:", req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  //console.log("Password before hashing:", hashedPassword);

  // Get the profile picture file
  //const profilePictureFile = req.files.profilePicture;

  // If the profile picture file is not defined, return an error
  /*if (!profilePictureFile) {
    return res.status(400).json({ message: 'Profile picture required' });
  }*/

  // Save the profile picture file to the database
  //const profilePicturePath = await saveProfilePictureFile(profilePictureFile);

  // Create a new user
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    //password: hashedPassword,
    password: hashedPassword,
    dateofbirth: req.body.dateofbirth,
    role: req.body.role,
    //profilePicture: req.body.profilePicture,
    //profilePicture: `${req.protocol}://${req.get('host')}/public/img/${req.files.profilePicture}`,
  });
  

  // Save the user to the database
  await user.save();
  //await sendWelcomeEmail(req.body.email);
  // Generate a JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullname: user.fullname, // Add the user's full name
      dateofbirth: user.dateofbirth,
    },
    config.SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Send the token back to the client
  res.status(201).json({ token });
}



// Saves the profile picture file to the database and returns the file path


// 
// Sign in a user
async function signin(req, res) {
  // Find the user by email
  const user = await User.findOne({ email: req.body.email });

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare the password provided by the client with the hashed password stored in the database
  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

  // If the password does not match, return a 401 error
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate a JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.SECRET_KEY,
    { expiresIn: '1h' }
  );

  // Send the token back to the client
  res.status(200).json({ token });
}

// Get all users
async function getAllUsers(req, res) {
  // Get all users from the database
  const users = await User.find();

  // Send the users back to the client
  res.status(200).json({ users });
}

// Find a user by ID
async function findUserById(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Send the user back to the client
  res.status(200).json({ user });
}

// Update a user
async function updateUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;
  
  // Find the user by ID
  const user = await User.findById(id);
  
  // If the user does not exist, return a 404 error
  if (!user) {
  return res.status(404).json({ message: 'User not found' });
  }
  
  // Update the user's fields
  const updatedFields = {};
  for (const key of ['email', 'profilebio', 'fullname', 'location', 'facebooklink', 'instagramlink', 'linkedinlink', 'phonenumber', 'profilepicture']) {
  if (req.body[key] !== undefined && req.body[key] !== null) {
  updatedFields[key] = req.body[key];
  }
  }
  
  // Set the user's fields
  Object.assign(user, updatedFields);
  
  // Save the user to the database
  await user.save();
  
  // Send the updated user back to the client
  res.status(200).json({ user });
  }
// Ban a user
async function banUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Set the user's `isBanned` field to `true`
  user.isBanned = true;

  // Save the user to the database
  await user.save();

  // Send a success response back to the client
  res.status(200).json({ message: 'User banned successfully' });
}

// Unban a user
async function unBanUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Set the user's `isBanned` field to `false`
  user.isBanned = false;

  // Save the user to the database
  await user.save();

  // Send a success response back to the client
  res.status(200).json({ message: 'User unbanned successfully' });
}

// Verify a user
async function verifyUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Set the user's `isVerified` field to `true`
  user.isVerified = true;

  // Save the user to the database
  await user.save();

  // Send a success response back to the client
  res.status(200).json({ message: 'User verified successfully' });
}

// Activate a user
async function activateUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Set the user's `isActive` field to `true`
  user.isActive = true;

  // Save the user to the database
  await user.save();

  // Send a success response back to the client
  res.status(200).json({ message: 'User activated successfully' });
}

// Deactivate a user
async function deactivateUser(req, res) {
  // Get the user ID from the request parameters
  const id = req.params.id;

  // Find the user by ID
  const user = await User.findById(id);

  // If the user does not exist, return a 404 error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Set the user's `isActive` field to `false`
  user.isActive = false;

  // Save the user to the database
  await user.save();

  // Send a success response back to the client
  res.status(200).json({ message: 'User deactivated successfully' });
}
async function getUsersByRole(req, res) {
  // Get the role from the request parameters
  const role = req.params.role;

  // Find all users with the specified role
  const users = await User.find({ role });

  // Send the users back to the client
  res.status(200).json({ users });
}
module.exports = {
  signup,
  signin,
  getAllUsers,
  findUserById,
  updateUser,
  banUser,
  unBanUser,
  verifyUser,
  activateUser,
  deactivateUser,
  getUsersByRole,
};