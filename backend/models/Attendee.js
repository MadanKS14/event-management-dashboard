const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for an Attendee
const attendeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  }
}, {
  timestamps: true,
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

module.exports = Attendee;
