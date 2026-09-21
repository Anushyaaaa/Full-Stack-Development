const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: [true, 'Registration ID is required'],
    unique: true,
    trim: true
  },
  eventId: {
    type: String,
    required: [true, 'Event ID is required'],
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true
  },
  registrationDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Waitlisted', 'Cancelled'],
    default: 'Confirmed'
  }
}, {
  timestamps: true
});

// Prevent duplicate registration for the same student and event
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
