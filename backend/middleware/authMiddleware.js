const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- ADD THIS NEW MIDDLEWARE FUNCTION ---
const isAdmin = (req, res, next) => {
  // Check if the user is attached to the request and has the 'Admin' role
  if (req.user && req.user.role === 'Admin') {
    next(); // User is an Admin, proceed to the next function (the controller)
  } else {const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach it to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- ADD THIS NEW MIDDLEWARE FUNCTION ---
const isAdmin = (req, res, next) => {
  // Check if the user is attached to the request and has the 'Admin' role
  if (req.user && req.user.role === 'Admin') {
    next(); // User is an Admin, proceed to the next function (the controller)
  } else {
    // If not an Admin, send a 'Forbidden' error
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};

// --- UPDATE THE EXPORTS ---
module.exports = { protect, isAdmin };
    // If not an Admin, send a 'Forbidden' error
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};

// --- UPDATE THE EXPORTS ---
module.exports = { protect, isAdmin };