// controllers/user.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
//const identicon = require('identicon.js');
//const { default: Identicon } = require('identicon.js');


async function signup(req, res) {
  // Hash the password
  console.log("Fullname before hashing:", req.body.fullname);
  console.log("Email before hashing:", req.body.email);
  console.log("Password before hashing:", req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

/*  const identifier = `${req.body.email}-${Math.random().toString(36).substr(2, 9)}`;

  // Create an Identicon hash based on the identifier
  const options = {
    text: identifier,
    size: 128, // Adjust the size as needed
    format: 'png' // Choose the desired format
  };
*/
  // Generate the profile picture using the hash
 // const randomgenerated = new Identicon(identifier, options);


  // Create a new user
  const user = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    //password: hashedPassword,
    password: hashedPassword,
    dateofbirth: req.body.dateofbirth,
    role: req.body.role,
    //profilePicture: randomgenerated,
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


// user profile

const authenticateUserProfile = async (req, res) => {
  try {
    const id = req.user._id;

    // Fetch user data using userId
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: `Cannot find any user with ID ${id}` });
    }

    // Extract relevant information from the user object
    const { email, fullname, dateofbirth, role, profilepicture, profilebio, location, phonenumber, isActive, isBanned, isVerified } = user;

    res.status(200).json({
      message: 'User profile authenticated successfully',
      id,
      email,
      fullname,
      dateofbirth,
      role,
      profilepicture,
      profilebio,
      location,
      phonenumber,
      isActive,
      isBanned,
      isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  //fullname
};

// Saves the profile picture file to the database and returns the file path
async function saveProfilePictureFile(profilePictureFile) {
  // Generate a unique file name
  const fileName = generateUniqueFileName(profilePictureFile.originalname);

  // Save the profile picture file to the public/images directory
  await profilePictureFile.mv(`public/images/${fileName}`);

  // Return the file path
  return `public/images/${fileName}`;
}

// Generates a unique file name
function generateUniqueFileName(fileName) {
  const timestamp = Date.now();
  return `${timestamp}-${fileName}`;
}
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
      _id: user._id,
      email: user.email,
      role: user.role,
      dateofbirth: user.dateofbirth,
      isActive: user.isActive,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
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
  for (const key of ['email', 'profilebio', 'fullname', 'location', 'facebooklink', 'instagramlink', 'phonenumber', 'profilepicture', 'dateofbirth', 'role']) {
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
// reset password
async function resetPassword(req, res) {
  const userId = req.params.id;
  const newPassword = req.params.newPassword;
  try {
    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    res.status(200).json({ message: 'Password reset successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: `Error resetting password: ${error.message}` });
  }
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

async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function comparePassword(enteredPassword, storedPassword) {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
}

async function checkPassword(req, res) {
  const userId = req.params.id;
  const enteredPassword = req.body.password; // Assuming the password is sent in the request body

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
    }

    const isPasswordMatch = await comparePassword(enteredPassword, user.password);

    if (isPasswordMatch) {
      return res.status(200).json({ message: 'Password is correct' });
    } else {
      return res.status(401).json({ message: 'Password is incorrect' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


/*
async function uploadrandomprofilepicture(req, res) {
  //const file = req.file;
  const userId = req.params.id;// Assume 'req.user' contains the logged-in user's information

  // Generate a random identifier based on the user ID
  const identifier = `${userId}-${Math.random().toString(36).substr(2, 9)}`;

  // Create an Identicon hash based on the identifier
  const hash = identicon.generate({
    text: identifier,
    size: 128, // Adjust the size as needed
    format: 'png' // Choose the desired format
  });

  // Generate the profile picture using the hash
  const profilePicture = identicon.generateFromHash(hash);

  // Save the profile picture data to the user's record
  await User.updateOne({ _id: userId }, { profilePicture });

  // Respond with a success message or redirect to the user's profile page
  res.send('Profile picture updated successfully');
}*/
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
  authenticateUserProfile,
  deleteUser,
  checkPassword,
  resetPassword,
  
};