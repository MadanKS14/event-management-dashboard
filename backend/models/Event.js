const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for an Event
const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'Attendee'
  }]
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
