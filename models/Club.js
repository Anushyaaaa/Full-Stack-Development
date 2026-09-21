const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: [true, 'Club ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Club description is required']
  },
  category: {
    type: String,
    required: [true, 'Club category is required'],
    default: 'General'
  },
  president: {
    type: String,
    default: 'Student President'
  },
  facultyCoordinator: {
    type: String,
    default: 'Faculty Advisor'
  },
  members: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    default: 'club@campus.edu'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  },
  meetingDay: {
    type: String,
    default: 'Every Friday'
  },
  meetingTime: {
    type: String,
    default: '4:00 PM - 5:30 PM'
  },
  location: {
    type: String,
    default: 'Innovation Lab, Block C'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);
