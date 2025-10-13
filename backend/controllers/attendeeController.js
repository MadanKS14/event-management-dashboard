const Attendee = require('../models/Attendee');

// Get all attendees
exports.getAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new attendee
exports.addAttendee = async (req, res) => {
  const { name, email } = req.body;
  const newAttendee = new Attendee({ name, email });

  try {
    const savedAttendee = await newAttendee.save();
    res.status(201).json(savedAttendee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an attendee
exports.deleteAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) {
        return res.status(404).json({ message: 'Attendee not found' });
    }
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
