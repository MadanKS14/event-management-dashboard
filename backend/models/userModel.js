const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  // --- ADD THIS NEW FIELD ---
  role: {
    type: String,
    enum: ['Admin', 'Attendee'], // The role can only be one of these two values
    default: 'Attendee',       // New users will be an 'Attendee' by default
  },
  // --- END OF CHANGE ---
}, {
  timestamps: true,
});

// Middleware to hash password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);