const Event = require('../models/Event');
const Club = require('../models/Club');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

// REST API: Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (status) filter.status = status;

    const events = await Event.find(filter).sort({ date: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message
    });
  }
};

// REST API: Get single event by eventId or _id
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    let event = await Event.findOne({ eventId: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with identifier: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event',
      error: error.message
    });
  }
};

// REST API: Create new event
exports.createEvent = async (req, res) => {
  try {
    const {
      eventId, title, description, category, date, time,
      venue, address, latitude, longitude, organizer, image, capacity
    } = req.body;

    if (!eventId || !title || !description || !date || !time || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: eventId, title, description, date, time, venue'
      });
    }

    const existing = await Event.findOne({ eventId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Event with eventId ${eventId} already exists`
      });
    }

    const lat = latitude || 12.9716;
    const lng = longitude || 77.5946;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    const newEvent = await Event.create({
      eventId,
      title,
      description,
      category: category || 'Technical',
      date,
      time,
      venue,
      address: address || `${venue}, College Campus`,
      latitude: lat,
      longitude: lng,
      mapUrl,
      organizer: organizer || 'Campus Club',
      image: image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      capacity: Number(capacity) || 200,
      registeredCount: 0,
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating event',
      error: error.message
    });
  }
};

// REST API: Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let event = await Event.findOne({ eventId: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found: ${id}`
      });
    }

    const updated = await Event.findOneAndUpdate(
      { _id: event._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message
    });
  }
};

// REST API: Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let event = await Event.findOne({ eventId: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found: ${id}`
      });
    }

    await Event.deleteOne({ _id: event._id });
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event',
      error: error.message
    });
  }
};

// ==========================================
// SERVER-SIDE RENDERED VIEWS (ZERO FRONTEND JS)
// ==========================================

// SSR: Home / Landing Page
exports.renderHomePage = async (req, res, next) => {
  try {
    // Dynamic Stats calculated on server
    const totalEvents = await Event.countDocuments();
    const totalClubs = await Club.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Upcoming events (top 3 to 6)
    const upcomingEvents = await Event.find({ status: { $ne: 'Completed' } })
      .sort({ date: 1 })
      .limit(6);

    // Featured clubs (top 4)
    const featuredClubs = await Club.find().sort({ members: -1 }).limit(4);

    res.render('index', {
      pageTitle: 'Campusly — College Event & Club Management Platform',
      activeNav: 'home',
      stats: {
        totalClubs: totalClubs || 50,
        totalEvents: totalEvents || 120,
        totalStudents: totalStudents || 8500,
        totalRegistrations: totalRegistrations || 4200,
        engagementRate: '95%'
      },
      upcomingEvents,
      featuredClubs
    });
  } catch (error) {
    next(error);
  }
};

// SSR: Events Catalog Page
exports.renderEventsPage = async (req, res, next) => {
  try {
    const selectedCategory = req.query.category || 'all';
    const filter = {};
    if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${selectedCategory}$`, 'i');
    }

    const events = await Event.find(filter).sort({ date: 1 });
    const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Academic'];

    res.render('events', {
      pageTitle: 'Upcoming Events — Campusly',
      activeNav: 'events',
      events,
      categories,
      selectedCategory
    });
  } catch (error) {
    next(error);
  }
};

// SSR: Event Details Page
exports.renderEventDetailsPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let event = await Event.findOne({ eventId: id });
    if (!event && id.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(id);
    }

    if (!event) {
      return res.status(404).render('404', {
        pageTitle: 'Event Not Found — Campusly',
        activeNav: 'events',
        message: `We couldn't find the event with ID "${id}". It may have been moved or removed.`
      });
    }

    const availableSeats = Math.max(0, event.capacity - event.registeredCount);

    res.render('event-details', {
      pageTitle: `${event.title} — Campusly`,
      activeNav: 'events',
      event,
      availableSeats
    });
  } catch (error) {
    next(error);
  }
};
