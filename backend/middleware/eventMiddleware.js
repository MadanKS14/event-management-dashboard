// backend/middleware/eventMiddleware.js

const Event = require('../models/eventModel');

// Middleware to check if an event is completed
const checkEventNotCompleted = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to the start of today

        // If the event date is in the past, it's completed
        if (new Date(event.date) < now) {
            return res.status(403).json({ message: 'Cannot modify a completed event.' });
        }

        // If the event is not completed, proceed
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { checkEventNotCompleted };