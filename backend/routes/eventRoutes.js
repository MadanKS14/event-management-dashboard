const router = require('express').Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById
} = require('../controllers/eventController');

// GET all events
router.get('/', getEvents);

// GET a single event by ID
router.get('/:id', getEventById);

// POST a new event
router.post('/', createEvent);

// PUT to update an event
router.put('/:id', updateEvent);

// DELETE an event
router.delete('/:id', deleteEvent);

module.exports = router;
