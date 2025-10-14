const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  addAttendee,
  getEventById,
  removeAttendee,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// All routes here are protected
router.route('/').get(protect, getEvents).post(protect, createEvent);
router.route('/:id').get(protect, getEventById).put(protect, updateEvent).delete(protect, deleteEvent);

// Route for managing attendees for a specific event
router.route('/:id/attendees').post(protect, addAttendee).delete(protect, removeAttendee);


module.exports = router;