require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes & controllers
const eventRoutes = require('./routes/events');
const clubRoutes = require('./routes/clubs');
const studentRoutes = require('./routes/students');
const registrationRoutes = require('./routes/registrations');
const mapRoutes = require('./routes/maps');
const eventController = require('./controllers/eventController');
const { seedDatabase } = require('./seeds/seedData');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusly';

// View Engine Setup (EJS - Server-Side Rendered)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (CSS, images, icons)
app.use(express.static(path.join(__dirname, 'public')));

// Mount Root / Homepage
app.get('/', eventController.renderHomePage);

// Mount Modular Application Routes
app.use('/', eventRoutes);
app.use('/', clubRoutes);
app.use('/', studentRoutes);
app.use('/', registrationRoutes);
app.use('/', mapRoutes);

// 404 Not Found Middleware
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  }
  res.status(404).render('404', {
    pageTitle: 'Page Not Found — Campusly',
    activeNav: '',
    message: `The campus page "${req.originalUrl}" could not be located.`
  });
});

// Centralized Error Handling Middleware (Safe from leaking internal stack traces)
app.use((err, req, res, next) => {
  console.error(`[Server Error] ${req.method} ${req.url}:`, err.message);

  if (req.path.startsWith('/api/')) {
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while processing your request.'
    });
  }

  res.status(500).render('500', {
    pageTitle: 'Server Error — Campusly',
    activeNav: '',
    message: 'An unexpected server error occurred. Our team has been notified.'
  });
});

// Start Server and Connect Database with Resilient Fallback
async function startServer() {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('Connected to MongoDB successfully');
    await seedDatabase();
  } catch (dbErr) {
    console.warn('\nNotice: Could not connect to local MongoDB daemon (' + dbErr.message + ').');
    console.warn('The application is running in resilient preview mode. Connect a live MongoDB instance in .env anytime.\n');
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Campusly Server running on: http://localhost:${PORT}`);
    console.log(` Frontend Architecture: 100% Pure HTML5/CSS3 (Zero JS)`);
    console.log(` REST APIs active on: http://localhost:${PORT}/api/events`);
    console.log(`====================================================\n`);
  });
}

startServer();

module.exports = app;
