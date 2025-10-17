const Task = require('../models/taskModel');
const Event = require('../models/eventModel');

// @desc    Create a task for an event
// @route   POST /api/tasks
// @access  Private (Admin)
const createTask = async (req, res) => {
    const { name, deadline, eventId, assignedAttendeeId } = req.body;

    if (!name || !deadline || !eventId || !assignedAttendeeId) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to manage this event' });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (new Date(event.date) < now) {
            return res.status(403).json({ message: 'Cannot add tasks to a completed event.' });
        }

        const task = await Task.create({
            name,
            deadline,
            event: eventId,
            assignedAttendee: assignedAttendeeId,
            assignedBy: req.user.id, // <-- FIX #1: Save who assigned the task
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Task creation failed', error: error.message });
    }
};

// @desc    Get all tasks for a specific event
// @route   GET /api/tasks/event/:eventId
// @access  Private
const getTasksByEvent = async (req, res) => {
    try {
        const tasks = await Task.find({ event: req.params.eventId }).populate('assignedAttendee', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    if (!status || !['Pending', 'Completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const event = await Event.findById(task.event);
        if (!event) {
            return res.status(404).json({ message: 'Associated event not found' });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (new Date(event.date) < now) {
            return res.status(403).json({ message: 'Cannot update tasks of a completed event.' });
        }

        const isEventCreator = event.createdBy.toString() === req.user.id;
        const isAssignedUser = task.assignedAttendee.toString() === req.user.id;
        if (!isEventCreator && !isAssignedUser) {
            return res.status(403).json({ message: 'User not authorized to update this task' });
        }

        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get event progress based on task completion
// @route   GET /api/tasks/progress/:eventId
// @access  Private
const getEventProgress = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ event: req.params.eventId });
        if (totalTasks === 0) {
            return res.status(200).json({ progress: 0 });
        }
        const completedTasks = await Task.countDocuments({ event: req.params.eventId, status: 'Completed' });
        const progress = Math.round((completedTasks / totalTasks) * 100);
        res.status(200).json({ progress });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get tasks assigned to the logged-in user
// @route   GET /api/tasks/mytasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedAttendee: req.user.id })
            .populate('event', 'name')
            .populate('assignedBy', 'name'); // <-- FIX #2: Populate the assigner's name

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in getMyTasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createTask,
    getTasksByEvent,
    updateTaskStatus,
    getEventProgress,
    getMyTasks,
};