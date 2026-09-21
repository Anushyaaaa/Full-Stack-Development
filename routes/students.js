const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// REST API Endpoints
router.get('/api/students', studentController.getAllStudents);
router.get('/api/students/:id', studentController.getStudentById);
router.post('/api/students', studentController.createStudent);
router.put('/api/students/:id', studentController.updateStudent);
router.delete('/api/students/:id', studentController.deleteStudent);

// Server-Side Rendered HTML Pages
router.get('/students', studentController.renderStudentsPage);

module.exports = router;
