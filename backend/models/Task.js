const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for a Task
const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  assignedAttendee: {
    type: Schema.Types.ObjectId,
    ref: 'Attendee',
    required: false // A task might not be assigned initially
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
