const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Student = require('../models/Student');

// REST API: Get all registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const { eventId, studentId } = req.query;
    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (studentId) filter.studentId = studentId;

    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations',
      error: error.message
    });
  }
};

// REST API: Get single registration by registrationId or _id
exports.getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    let registration = await Registration.findOne({ registrationId: id });
    if (!registration && id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registration',
      error: error.message
    });
  }
};

// REST API: Create registration via JSON API
exports.createRegistrationApi = async (req, res) => {
  try {
    const { eventId, studentId, studentName, studentEmail } = req.body;

    if (!eventId || !studentId) {
      return res.status(400).json({
        success: false,
        message: 'eventId and studentId are required'
      });
    }

    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event ${eventId} not found`
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'This event has reached full capacity'
      });
    }

    // Check duplicate
    const existing = await Registration.findOne({ eventId, studentId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Student ${studentId} is already registered for event ${eventId}`
      });
    }

    const registrationId = 'REG' + Math.floor(100000 + Math.random() * 900000);
    const newReg = await Registration.create({
      registrationId,
      eventId,
      studentId,
      studentName: studentName || 'Student Participant',
      studentEmail: (studentEmail || `${studentId}@campus.edu`).toLowerCase(),
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed'
    });

    // Increment registeredCount
    await Event.updateOne({ _id: event._id }, { $inc: { registeredCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Registration confirmed',
      data: newReg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating registration',
      error: error.message
    });
  }
};

// REST API: Delete / Cancel registration
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    let registration = await Registration.findOne({ registrationId: id });
    if (!registration && id.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await Registration.findById(id);
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: `Registration not found: ${id}`
      });
    }

    // Decrement registered count
    await Event.updateOne({ eventId: registration.eventId }, { $inc: { registeredCount: -1 } });
    await Registration.deleteOne({ _id: registration._id });

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error cancelling registration',
      error: error.message
    });
  }
};

// ==========================================
// SERVER-SIDE RENDERED VIEWS (ZERO FRONTEND JS)
// ==========================================

// SSR: Show Registration Form
exports.renderRegisterPage = async (req, res, next) => {
  try {
    const preselectedEventId = req.query.eventId || '';
    const events = await Event.find({ status: { $ne: 'Completed' } }).sort({ date: 1 });

    res.render('register', {
      pageTitle: 'Event Registration — Campusly',
      activeNav: 'events',
      events,
      preselectedEventId,
      formData: {},
      errorMessage: null
    });
  } catch (error) {
    next(error);
  }
};

// SSR: Process Registration HTML Form POST
exports.handleFormRegistration = async (req, res, next) => {
  try {
    const { studentId, studentName, studentEmail, eventId } = req.body;
    const events = await Event.find({ status: { $ne: 'Completed' } }).sort({ date: 1 });

    // Validate inputs
    if (!studentId || !studentName || !studentEmail || !eventId) {
      return res.status(400).render('register', {
        pageTitle: 'Event Registration — Campusly',
        activeNav: 'events',
        events,
        preselectedEventId: eventId || '',
        formData: req.body,
        errorMessage: 'All fields are required. Please fill in your Student ID, Name, Email, and select an Event.'
      });
    }

    const event = await Event.findOne({ eventId });
    if (!event) {
      return res.status(404).render('register', {
        pageTitle: 'Event Registration — Campusly',
        activeNav: 'events',
        events,
        preselectedEventId: '',
        formData: req.body,
        errorMessage: 'Selected event could not be found. Please pick an active campus event.'
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).render('register', {
        pageTitle: 'Event Registration — Campusly',
        activeNav: 'events',
        events,
        preselectedEventId: eventId,
        formData: req.body,
        errorMessage: `Sorry! "${event.title}" has reached full capacity (${event.capacity} seats).`
      });
    }

    // Check duplicate registration
    const existing = await Registration.findOne({
      eventId: event.eventId,
      studentId: studentId.trim().toUpperCase()
    });

    if (existing) {
      return res.status(409).render('register', {
        pageTitle: 'Event Registration — Campusly',
        activeNav: 'events',
        events,
        preselectedEventId: eventId,
        formData: req.body,
        errorMessage: `Student ID "${studentId.trim().toUpperCase()}" is ALREADY registered for "${event.title}". Duplicate registrations are prevented.`
      });
    }

    // Upsert or record student in Students collection
    const cleanStudentId = studentId.trim().toUpperCase();
    let student = await Student.findOne({ studentId: cleanStudentId });
    if (!student) {
      await Student.create({
        studentId: cleanStudentId,
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        department: 'Engineering',
        year: 3,
        section: 'A'
      });
    }

    // Create registration
    const registrationId = 'REG-' + Math.floor(100000 + Math.random() * 900000);
    const regDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const newRegistration = await Registration.create({
      registrationId,
      eventId: event.eventId,
      studentId: cleanStudentId,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      registrationDate: regDate,
      status: 'Confirmed'
    });

    // Increment registeredCount on the event
    await Event.updateOne({ _id: event._id }, { $inc: { registeredCount: 1 } });

    // Render Registration Success Page
    res.status(200).render('registration-success', {
      pageTitle: 'Registration Confirmed! — Campusly',
      activeNav: 'events',
      registration: newRegistration,
      event
    });
  } catch (error) {
    // Handle MongoDB unique key duplicate error
    if (error.code === 11000) {
      const events = await Event.find().sort({ date: 1 });
      return res.status(409).render('register', {
        pageTitle: 'Event Registration — Campusly',
        activeNav: 'events',
        events,
        preselectedEventId: req.body.eventId || '',
        formData: req.body,
        errorMessage: 'A duplicate registration for this Student ID and Event already exists.'
      });
    }
    next(error);
  }
};
