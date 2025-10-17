const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByEvent,
  updateTaskStatus,
  getEventProgress,
  getMyTasks,
} = require('../controllers/taskController');
// Import both protect and isAdmin middlewares
const { protect, isAdmin } = require('../middleware/authMiddleware');

// This line applies the 'protect' middleware to ALL routes defined after it.
// It ensures the user is logged in for every task-related action.
router.use(protect);

// Now, all subsequent routes are automatically protected.

// Route for an attendee to get their own tasks
router.get('/mytasks', getMyTasks);

// Route for an admin to get all tasks for a specific event
router.get('/event/:eventId', getTasksByEvent);

// Route for an attendee or admin to update a task's status
router.put('/:id', updateTaskStatus);

// Route for getting an event's progress
router.get('/progress/:eventId', getEventProgress);

// The createTask route needs an additional 'isAdmin' check to ensure
// only admins can create new tasks.
router.post('/', isAdmin, createTask);

module.exports = router;