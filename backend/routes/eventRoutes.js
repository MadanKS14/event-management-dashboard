const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  addAttendee,
  removeAttendee,
} = require('../controllers/eventController');

// Import middleware
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { checkEventNotCompleted } = require('../middleware/eventMiddleware');

// Route for getting all events (accessible to any logged-in user)
// and creating a new event (accessible only to Admins)
router.route('/')
  .get(protect, getEvents)
  .post(protect, isAdmin, createEvent);

// Routes for a single, specific event
router.route('/:id')
  // Any logged-in user can view an event's details
  .get(protect, getEventById)
  // Only Admins can update an event, and only if it's not completed
  .put(protect, isAdmin, checkEventNotCompleted, updateEvent)
  // Only Admins can delete an event, and only if it's not completed
  .delete(protect, isAdmin, checkEventNotCompleted, deleteEvent);

// Routes for managing attendees of a specific event
router.route('/:id/attendees')
  // Only Admins can add attendees, and only if the event is not completed
  .post(protect, isAdmin, checkEventNotCompleted, addAttendee)
  // Only Admins can remove attendees, and only if the event is not completed
  .delete(protect, isAdmin, checkEventNotCompleted, removeAttendee);

module.exports = router;