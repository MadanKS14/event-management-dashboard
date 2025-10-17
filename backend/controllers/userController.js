const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// --- 1. UPDATE generateToken TO INCLUDE THE ROLE ---
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = await User.create({ name, email, password });
    
    // --- 2. UPDATE THE RESPONSE TO INCLUDE THE ROLE ---
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // <-- Send the role
      token: generateToken(user._id, user.role), // <-- Pass role to token generator
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data', error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    // --- 3. UPDATE THE RESPONSE TO INCLUDE THE ROLE ---
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role, // <-- Send the role
      token: generateToken(user._id, user.role), // <-- Pass role to token generator
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a user (by an Admin)
// @route   POST /api/users
// @access  Private (Admin)
const createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all fields including a role' });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  try {
    // Create the user with the specified role
    const user = await User.create({ name, email, password, role });

    // Send back the created user's data (without the password)
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data', error: error.message });
  }
};

// @desc    Update user profile (name)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide all password fields' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = newPassword; // The pre-save hook will hash this
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  createUserByAdmin,
  changeUserPassword,
  updateUserProfile,
};