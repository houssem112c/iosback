// controllers/user.controller.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');
const ExcelJS = require('exceljs');

//const identicon = require('identicon.js');
//const { default: Identicon } = require('identicon.js');

async function exportUsers(req, res) {
  try {
    // Fetch users from your database
    const users = await User.find({}, { _id: 0, __v: 0 });

    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');

    // Add header row
    sheet.addRow(['Full Name', 'Email', 'Role', 'Active', 'Banned', 'Verified']);

    // Add user data rows
    users.forEach(user => {
      sheet.addRow([user.fullname, user.email, user.role, user.isActive, user.isBanned, user.isVerified]);
    });

    // Set up response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    // Send the Excel file as a response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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
  res.status(200).json({ list:users });
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

async function getTotalUsersCount(req, res) {
  try {
    const users = await User.find();
    const totalUsersCount = users.length;
    res.status(200).json({ totalUsersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get the number of active users
async function getActiveUsersCount(req, res) {
  try {
    const activeUsers = await User.find({ isActive: true });
    const activeUsersCount = activeUsers.length;
    res.status(200).json({ activeUsersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get the number of banned users
async function getBannedUsersCount(req, res) {
  try {
    const bannedUsers = await User.find({ isBanned: true });
    const bannedUsersCount = bannedUsers.length;
    res.status(200).json({ bannedUsersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get the number of verified users
async function getVerifiedUsersCount(req, res) {
  try {
    const verifiedUsers = await User.find({ isVerified: true });
    const verifiedUsersCount = verifiedUsers.length;
    res.status(200).json({ verifiedUsersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get the number of users with a specific role (replace 'desiredRole' with the actual role)
async function getUsersCountByRole(req, res) {
  const desiredRole = req.params.role;
  try {
    const usersWithRole = await User.find({ role: desiredRole });
    const usersWithRoleCount = usersWithRole.length;
    res.status(200).json({ usersWithRoleCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a creative statistic: Number of users with a profile picture
async function getUsersWithProfilePictureCount(req, res) {
  try {
    const usersWithProfilePicture = await User.find({ profilePicture: { $exists: true } });
    const usersWithProfilePictureCount = usersWithProfilePicture.length;
    res.status(200).json({ usersWithProfilePictureCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function searchUsers(req, res) {
  try {
    const query = req.params.query.toLowerCase(); // Use req.params to get the query parameter

    // Perform the search query on the user data
    const filteredUsers = await User.find({
      $or: [
        { fullname: { $regex: query, $options: 'i' } }, // Case-insensitive regex search for fullname
        { email: { $regex: query, $options: 'i' } },    // Case-insensitive regex search for email
      ]
    });

    res.status(200).json({ filteredUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function findUserIdByEmail(req, res) {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json({ userId: user._id });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error finding user by email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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
  authenticateUserProfile,
  deleteUser,
  checkPassword,
  resetPassword,
  getTotalUsersCount,
  getActiveUsersCount,
  getBannedUsersCount,
  getVerifiedUsersCount,
  getUsersCountByRole,
  getUsersWithProfilePictureCount,
  searchUsers,
  exportUsers,
  findUserIdByEmail,
};