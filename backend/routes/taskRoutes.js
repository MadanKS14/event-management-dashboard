const router = require('express').Router();
const {
  getTasksForEvent,
  createTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/TaskController');

// GET tasks for a specific event
router.get('/event/:eventId', getTasksForEvent);

// POST a new task
router.post('/', createTask);

// PATCH to update a task's status
router.patch('/:id', updateTaskStatus);

// DELETE a task
router.delete('/:id', deleteTask);

module.exports = router;
