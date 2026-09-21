# College Event & Club Management Platform

A modern, full-stack university technology platform built with **Node.js, Express.js, EJS Server-Side Rendering, and MongoDB**, featuring **100% Pure HTML5 & CSS3** on the browser side (**Zero Client-Side JavaScript**).

---

## Description

**Campusly** is an intelligent university technology platform designed to modernize campus student life. It provides a unified portal where students can discover events across technical, cultural, sports, and academic domains, explore and join student organizations, reserve entry passes, and connect with peers across disciplines.

The application follows an uncompromising architectural standard: **ZERO FRONTEND JAVASCRIPT**. All data rendering, filtering, registration processing, and view transitions occur securely on the server via Express.js and EJS templates, ensuring peak performance, accessibility, and clean separation of concerns.

---

## Features

- **Zero Client-Side JavaScript**: Browser-facing pages contain 0 `<script>` tags, 0 client-side frameworks, 0 DOM event listeners, and 0 AJAX/Fetch calls. All interactions rely on standard HTML5 forms and hyperlinks.
- **Glassmorphism & Neon Aesthetics**: Deep void navy backdrop (`#060713`, `#0a0c20`) with electric blue, violet, and cyan glowing accents, and `backdrop-filter: blur()` glass cards.
- **Full-Screen Dynamic Hero**:
  - Live status indicator: `"SMART CAMPUS • CONNECT • COLLABORATE • CREATE"`.
  - Multi-stop gradient typography.
  - Interactive 3D glass dashboard with live campus photo and attendee avatar stack.
  - Floating satellite badges: *Upcoming Event (TechFest 2026)*, *Club Spotlight (AI & Robotics)*, and *Event Registration (87% Filled)*.
- **Dynamic Campus Statistics Strip**: Server-calculated metrics for Active Clubs, Annual Events, Student Members, and Engagement Rate.
- **Event Discovery & Filter System**: Browse technical, cultural, sports, and academic events with pure CSS category filter tabs.
- **Event Details & Maps Integration**: Comprehensive event pages with available seat counters, venue guidelines, and server-side Google Maps integration.
- **Club Directory & Spotlights**: Complete directory showing leadership, faculty coordinators, meeting days, locations, and member counts.
- **Student Community Showcase**: Peer directory highlighting student departments, academic years, and technical interest tags.
- **Event Registration System**:
  - Pure HTML form (`POST /register`) with duplicate registration prevention.
  - Automatic event seat capacity tracking.
  - Printable/savable glassmorphic confirmation pass with unique Registration ID.
- **Server-Side Error Handling**: Friendly, branded 404 Not Found and 500 Server Error pages that never leak sensitive database credentials or stack traces.
- **Fully Responsive**: Optimized for desktop (1440px, 1200px), tablets (768px), and mobile viewports (480px, 360px) using CSS media queries and a pure CSS mobile menu toggle.

---

## APIs

The platform provides 5 RESTful API services:

1. **Events API**: Full CRUD capabilities for managing campus events, categories, seating capacities, and registrations.
2. **Clubs API**: Endpoints to manage student clubs, coordinators, meeting schedules, and member directories.
3. **Students API**: Privacy-conscious student profile management for registration and club association.
4. **Event Registration API**: Handles registration creation, verification, duplicate prevention, and seat incrementing.
5. **Maps API**: Server-side geolocation service providing latitude, longitude, addresses, and external Google Maps links for campus event venues.

---

## Technologies

- **Frontend**:
  - HTML5 (Semantic Structure)
  - CSS3 (Vanilla CSS, Custom Properties, Glassmorphism, Keyframe Animations)
  - EJS (Embedded JavaScript Server-Side Templating)
  - *Strictly 0 Client-Side JavaScript*
- **Backend**:
  - Node.js (Runtime)
  - Express.js (Web Application & REST API Framework)
  - dotenv (Environment Management)
  - cors (Cross-Origin Resource Sharing)
- **Database**:
  - MongoDB
  - Mongoose (Object Data Modeling)
  - Built-in Initial Seed Data Loader

---

## API Endpoints

### 1. Events API (`/api/events`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/events` | Retrieve all events (supports `?category=Technical`) |
| `GET` | `/api/events/:id` | Retrieve single event by `eventId` or `_id` |
| `POST` | `/api/events` | Create a new event |
| `PUT` | `/api/events/:id` | Update an existing event |
| `DELETE` | `/api/events/:id` | Delete an event |

### 2. Clubs API (`/api/clubs`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/clubs` | Retrieve all clubs |
| `GET` | `/api/clubs/:id` | Retrieve single club by `clubId` or `_id` |
| `POST` | `/api/clubs` | Create a new club |
| `PUT` | `/api/clubs/:id` | Update an existing club |
| `DELETE` | `/api/clubs/:id` | Delete a club |

### 3. Students API (`/api/students`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/students` | Retrieve student list (sanitized, hides phone numbers) |
| `GET` | `/api/students/:id` | Retrieve single student profile |
| `POST` | `/api/students` | Register a new student |
| `PUT` | `/api/students/:id` | Update student profile |
| `DELETE` | `/api/students/:id` | Delete a student record |

### 4. Registrations API (`/api/registrations`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/registrations` | List all event registrations |
| `GET` | `/api/registrations/:id` | Retrieve registration pass by `registrationId` or `_id` |
| `POST` | `/api/registrations` | Create registration via JSON API |
| `DELETE` | `/api/registrations/:id` | Cancel registration and decrement attendee count |

### 5. Maps API (`/api/maps`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/maps/venues` | Get all campus venue coordinates and map URLs |
| `GET` | `/api/maps/venue/:eventId` | Get venue location for a specific event |

---

## Server-Side HTML Web Routes

| Route | Method | Template | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | `views/index.ejs` | Landing page with dynamic database stats, upcoming events, and clubs |
| `/events` | `GET` | `views/events.ejs` | Full event catalog with category filtering |
| `/events/:id` | `GET` | `views/event-details.ejs`| Detailed event view with Google Maps location link & registration CTA |
| `/clubs` | `GET` | `views/clubs.ejs` | Complete club directory |
| `/clubs/:id` | `GET` | `views/club-details.ejs` | Club leadership, meeting times, and join info |
| `/students` | `GET` | `views/students.ejs` | Student community network & profiles |
| `/register` | `GET` | `views/register.ejs` | Server-rendered event registration form |
| `/register` | `POST` | `views/registration-success.ejs` | Handles registration form, updates seats, prevents duplicates |

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Anushyaaaa/Full-Stack-Development.git
   cd Full-Stack-Development
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## Environment Setup

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/campusly
MAPS_API_KEY=
```

> **Note**: If a local MongoDB daemon is not running, the application gracefully launches in resilient preview mode with seed data.

---

## Run

To start the server:

```bash
npm start
```

Or run directly with Node:

```bash
node server.js
```

Open your browser and navigate to:
```text
http://localhost:3000
```

---

## Project Structure

```text
Full-Stack-Development/
│
├── server.js                          # Express application entrypoint, MongoDB connection & seed loader
├── package.json                       # Project metadata & dependencies
├── .env                               # Environment configurations (Git-ignored)
├── .env.example                       # Example environment file template
├── .gitignore                         # Git exclusion rules
├── README.md                          # Project documentation
│
├── public/                            # Static assets served by Express
│   ├── css/
│   │   └── style.css                  # Unified CSS3 design system & animations
│   ├── images/                        # Local image assets
│   └── icons/                         # SVG icons
│
├── models/                            # Mongoose database models
│   ├── Event.js                       # Event schema & validation
│   ├── Club.js                        # Club schema & validation
│   ├── Student.js                     # Student schema & validation
│   └── Registration.js                # Registration schema & unique compound indexing
│
├── controllers/                       # Business logic for REST APIs & SSR templates
│   ├── eventController.js             # Event CRUD and view rendering
│   ├── clubController.js              # Club CRUD and view rendering
│   ├── studentController.js           # Student CRUD and view rendering
│   ├── registrationController.js      # Registration processing & duplicate prevention
│   └── mapController.js               # Geolocation & maps navigation data
│
├── routes/                            # Modular Express router definitions
│   ├── events.js                      # Events API & web routes
│   ├── clubs.js                       # Clubs API & web routes
│   ├── students.js                    # Students API & web routes
│   ├── registrations.js               # Registration API & form submission routes
│   └── maps.js                        # Maps API routes
│
├── views/                             # EJS server-rendered templates (Zero Frontend JS)
│   ├── partials/
│   │   ├── header.ejs                 # Sticky glassmorphic navbar (Pure CSS)
│   │   └── footer.ejs                 # Unified footer & ambient background
│   ├── index.ejs                      # Dynamic landing page
│   ├── events.ejs                     # Event catalog with category filter tabs
│   ├── event-details.ejs              # Event detail view with Google Maps link
│   ├── clubs.ejs                      # Clubs catalog
│   ├── club-details.ejs               # Club detail view
│   ├── students.ejs                   # Student community directory
│   ├── register.ejs                   # Registration form with error alerts
│   ├── registration-success.ejs       # Official registration receipt pass
│   ├── 404.ejs                        # Glassmorphic 404 page
│   └── 500.ejs                        # User-friendly 500 error page
│
└── seeds/
    └── seedData.js                    # Initial events, clubs, students & registrations
```

---

## Future Scope

- **Authentication & Role-Based Access Control**: Student and faculty coordinator logins via secure JWT/sessions.
- **Admin Dashboard**: Visual analytics portal for event coordinators to view attendee rosters and export CSVs.
- **Club Membership Management**: Automated member approval queues, fee processing, and roles (Lead, Co-Lead, Member).
- **Automated Notifications**: Email and SMS notifications for registration confirmations and schedule updates.
- **AI Event Recommendations**: Intelligent event recommendations based on student department, year, and stated interests.
- **QR Code Attendance Management**: Check-in scanning at venue doors using unique QR tokens on registration passes.
- **Advanced Campus Analytics**: Heatmaps of student participation across semesters and departments.

---

## License

Created for Full Stack Development (FSD).
&copy; 2026 Campusly. College Event & Club Management Platform.
