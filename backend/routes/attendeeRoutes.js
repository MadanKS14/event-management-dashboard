const router = require('express').Router();
const {
  getAttendees,
  addAttendee,
  deleteAttendee
} = require('../controllers/attendeeController');

// GET all attendees
router.get('/', getAttendees);

// POST a new attendee
router.post('/', addAttendee);

// DELETE an attendee
router.delete('/:id', deleteAttendee);

module.exports = router;
