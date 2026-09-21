const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// REST API Endpoints
router.get('/api/events', eventController.getAllEvents);
router.get('/api/events/:id', eventController.getEventById);
router.post('/api/events', eventController.createEvent);
router.put('/api/events/:id', eventController.updateEvent);
router.delete('/api/events/:id', eventController.deleteEvent);

// Server-Side Rendered HTML Pages
router.get('/events', eventController.renderEventsPage);
router.get('/events/:id', eventController.renderEventDetailsPage);

module.exports = router;
