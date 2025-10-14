const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByEvent,
  updateTaskStatus,
  getEventProgress,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protect all task routes
router.use(protect);

router.post('/', createTask);
router.get('/event/:eventId', getTasksByEvent);
router.put('/:id', updateTaskStatus);
router.get('/progress/:eventId', getEventProgress); // For the bonus point

module.exports = router;