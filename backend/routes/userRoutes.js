const express = require('express');
const router = express.Router();
const { registerUser, loginUser , getUsers , createUserByAdmin ,updateUserProfile,changeUserPassword} = require('../controllers/userController');
const { protect,isAdmin } = require('../middleware/authMiddleware');


// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only routes
router.route('/')
  .get(protect, isAdmin, getUsers) // Only admins can see all users
  .post(protect, isAdmin, createUserByAdmin); // Only admins can create new users

module.exports = router;


router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/').get(protect, getUsers); 
// Route for updating a user's own profile
router.put('/profile', protect, updateUserProfile);

// Route for changing a user's own password
router.put('/change-password', protect, changeUserPassword);


module.exports = router;
