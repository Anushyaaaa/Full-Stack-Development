const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// REST API Endpoints
router.get('/api/registrations', registrationController.getAllRegistrations);
router.get('/api/registrations/:id', registrationController.getRegistrationById);
router.post('/api/registrations', registrationController.createRegistrationApi);
router.delete('/api/registrations/:id', registrationController.deleteRegistration);

// Server-Side Rendered HTML Form & Submission
router.get('/register', registrationController.renderRegisterPage);
router.post('/register', registrationController.handleFormRegistration);

module.exports = router;
