const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

// REST API Endpoints
router.get('/api/clubs', clubController.getAllClubs);
router.get('/api/clubs/:id', clubController.getClubById);
router.post('/api/clubs', clubController.createClub);
router.put('/api/clubs/:id', clubController.updateClub);
router.delete('/api/clubs/:id', clubController.deleteClub);

// Server-Side Rendered HTML Pages
router.get('/clubs', clubController.renderClubsPage);
router.get('/clubs/:id', clubController.renderClubDetailsPage);

module.exports = router;
