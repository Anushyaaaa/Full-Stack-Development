const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// Maps REST API Endpoints
router.get('/api/maps/venues', mapController.getAllVenues);
router.get('/api/maps/venue/:eventId', mapController.getVenueByEventId);

module.exports = router;
