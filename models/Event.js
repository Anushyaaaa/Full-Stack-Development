const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, 'Event ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    default: 'General'
  },
  date: {
    type: String,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required']
  },
  address: {
    type: String,
    default: 'Main Campus Arena, College Campus'
  },
  latitude: {
    type: Number,
    default: 12.9716
  },
  longitude: {
    type: Number,
    default: 77.5946
  },
  mapUrl: {
    type: String,
    default: 'https://www.google.com/maps/search/?api=1&query=12.9716,77.5946'
  },
  organizer: {
    type: String,
    default: 'Campus Student Council'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  },
  capacity: {
    type: Number,
    default: 200
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Closing Soon', 'Full', 'Completed'],
    default: 'Open'
  }
}, {
  timestamps: true
});

if (!mongoose.models.Event) {
  mongoose.model('Event', eventSchema);
}

const { Event } = require('../db/store');
module.exports = Event;
