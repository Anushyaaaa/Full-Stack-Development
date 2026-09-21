const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Student email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: '0000000000'
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  year: {
    type: Number,
    default: 3
  },
  section: {
    type: String,
    default: 'A'
  },
  interests: {
    type: [String],
    default: ['Artificial Intelligence', 'Web Development', 'Robotics']
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
