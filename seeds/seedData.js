const Event = require('../models/Event');
const Club = require('../models/Club');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

const seedEvents = [
  {
    eventId: 'EVT001',
    title: 'TechFest 2026',
    description: 'Annual technology and innovation festival featuring robotics showdowns, 36-hour hackathons, and hardware showcases.',
    category: 'Technology',
    date: '2026-10-24',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    address: 'Auditorium Hall A, North Campus, College Campus',
    latitude: 12.9716,
    longitude: 77.5946,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9716,77.5946',
    organizer: 'Computer Science & Robotics Clubs',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    capacity: 500,
    registeredCount: 142,
    status: 'Open'
  },
  {
    eventId: 'EVT002',
    title: 'Cultural Carnival',
    description: 'Celebrate music, art, dance and diversity with campus rock bands, expressive drama showcases, and multicultural food bazaars.',
    category: 'Cultural',
    date: '2026-11-02',
    time: '04:00 PM',
    venue: 'Open Air Amphitheatre',
    address: 'Campus Amphitheatre & Central Lawns, College Campus',
    latitude: 12.9720,
    longitude: 77.5950,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9720,77.5950',
    organizer: 'Cultural Arts Society',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    capacity: 800,
    registeredCount: 310,
    status: 'Open'
  },
  {
    eventId: 'EVT003',
    title: 'AI & Robotics Summit',
    description: 'Explore the future of artificial intelligence and robotics with live autonomous demonstrations, generative AI labs, and research talks.',
    category: 'Technical',
    date: '2026-11-15',
    time: '09:30 AM',
    venue: 'Innovation Center • Hall 3',
    address: 'Block C Innovation Hub, College Campus',
    latitude: 12.9725,
    longitude: 77.5960,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9725,77.5960',
    organizer: 'AI & Robotics Club',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    capacity: 350,
    registeredCount: 195,
    status: 'Open'
  },
  {
    eventId: 'EVT004',
    title: 'National Hackathon Blitz',
    description: 'Over 40 universities competing in high-intensity software sprints solving sustainability and healthcare challenges with mentors.',
    category: 'Technical',
    date: '2026-11-28',
    time: '08:00 AM',
    venue: 'Advanced Computing Lab',
    address: 'CS Department, 4th Floor, College Campus',
    latitude: 12.9710,
    longitude: 77.5940,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9710,77.5940',
    organizer: 'Coding Club',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    capacity: 250,
    registeredCount: 215,
    status: 'Closing Soon'
  },
  {
    eventId: 'EVT005',
    title: 'Annual Campus Sports Gala',
    description: 'Inter-departmental championship across football, basketball, badminton, athletics, and track events with official awards.',
    category: 'Sports',
    date: '2026-12-05',
    time: '07:30 AM',
    venue: 'University Stadium',
    address: 'South Athletic Complex, College Campus',
    latitude: 12.9700,
    longitude: 77.5930,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9700,77.5930',
    organizer: 'Sports Department',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    capacity: 1000,
    registeredCount: 420,
    status: 'Open'
  },
  {
    eventId: 'EVT006',
    title: 'Design & Visual Arts Expo',
    description: 'Showcasing student graphic design, fine arts, UI/UX interaction experiments, photography collections, and digital prints.',
    category: 'Academic',
    date: '2026-12-12',
    time: '11:00 AM',
    venue: 'Media & Design Gallery',
    address: 'Art & Design Wing, East Block, College Campus',
    latitude: 12.9730,
    longitude: 77.5970,
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.9730,77.5970',
    organizer: 'Photography & Creative Club',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    capacity: 300,
    registeredCount: 88,
    status: 'Open'
  }
];

const seedClubs = [
  {
    clubId: 'CLUB001',
    name: 'AI & Robotics Club',
    description: 'A community for students passionate about robotics, embedded systems, computer vision, and neural network development.',
    category: 'Technical',
    president: 'Arjun Mehta',
    facultyCoordinator: 'Dr. Ramesh Kumar',
    members: 320,
    email: 'airobotics@college.edu',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    meetingDay: 'Friday',
    meetingTime: '4:00 PM - 6:00 PM',
    location: 'Innovation Lab, Block C'
  },
  {
    clubId: 'CLUB002',
    name: 'Coding Club',
    description: 'From competitive programming and hackathons to open-source contributions, we ship real code and level up technical skills.',
    category: 'Technical',
    president: 'Sneha Patel',
    facultyCoordinator: 'Prof. Anita Sharma',
    members: 580,
    email: 'codingclub@college.edu',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    meetingDay: 'Wednesday',
    meetingTime: '5:00 PM - 6:30 PM',
    location: 'Computer Center Lab 2'
  },
  {
    clubId: 'CLUB003',
    name: 'Photography Club',
    description: 'Master digital photography, studio lighting techniques, photo walks, photojournalism, and capture unforgettable campus life.',
    category: 'Creative Arts',
    president: 'Karan Verma',
    facultyCoordinator: 'Prof. David Lee',
    members: 240,
    email: 'photography@college.edu',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    meetingDay: 'Saturday',
    meetingTime: '10:00 AM - 12:00 PM',
    location: 'Media Studio B'
  },
  {
    clubId: 'CLUB004',
    name: 'Cultural Club',
    description: 'Express your artistic soul through live band performances, theatre, classical and modern dance, and multicultural showcases.',
    category: 'Cultural',
    president: 'Meera Nambiar',
    facultyCoordinator: 'Dr. Shalini Rao',
    members: 410,
    email: 'cultural@college.edu',
    image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
    meetingDay: 'Thursday',
    meetingTime: '4:30 PM - 6:30 PM',
    location: 'Performing Arts Auditorium'
  },
  {
    clubId: 'CLUB005',
    name: 'E-Cell (Entrepreneurship Club)',
    description: 'Incubate campus startups, connect with angel investors, pitch in venture competitions, and build market-ready products.',
    category: 'Business & Leadership',
    president: 'Rohan Gupta',
    facultyCoordinator: 'Prof. Vikram Saxena',
    members: 275,
    email: 'ecell@college.edu',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    meetingDay: 'Tuesday',
    meetingTime: '4:00 PM - 5:30 PM',
    location: 'Business Incubation Center'
  }
];

const seedStudents = [
  {
    studentId: 'STU001',
    name: 'Anushya C',
    email: 'anushya@college.edu',
    phone: '9876543210',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'A',
    interests: ['Artificial Intelligence', 'Web Development', 'Robotics'],
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    studentId: 'STU002',
    name: 'Priya Sharma',
    email: 'priya.s@college.edu',
    phone: '9876543211',
    department: 'Information Science',
    year: 2,
    section: 'B',
    interests: ['UI/UX Design', 'Cloud Computing', 'Event Management'],
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  {
    studentId: 'STU003',
    name: 'Alex Chen',
    email: 'alex.chen@college.edu',
    phone: '9876543212',
    department: 'Electronics & Communication',
    year: 4,
    section: 'A',
    interests: ['Embedded Systems', 'IoT', 'Competitive Gaming'],
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
  },
  {
    studentId: 'STU004',
    name: 'Sarah Jenkins',
    email: 'sarah.j@college.edu',
    phone: '9876543213',
    department: 'Computer Science & Engineering',
    year: 3,
    section: 'C',
    interests: ['Cybersecurity', 'Open Source', 'Technical Writing'],
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  }
];

const seedRegistrations = [
  {
    registrationId: 'REG-104921',
    eventId: 'EVT001',
    studentId: 'STU002',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.s@college.edu',
    registrationDate: '2026-09-18',
    status: 'Confirmed'
  },
  {
    registrationId: 'REG-104922',
    eventId: 'EVT003',
    studentId: 'STU003',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@college.edu',
    registrationDate: '2026-09-19',
    status: 'Confirmed'
  }
];

async function seedDatabase() {
  try {
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany(seedEvents);
      console.log('Seeded Events collection');
    }

    const clubCount = await Club.countDocuments();
    if (clubCount === 0) {
      await Club.insertMany(seedClubs);
      console.log('Seeded Clubs collection');
    }

    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(seedStudents);
      console.log('Seeded Students collection');
    }

    const regCount = await Registration.countDocuments();
    if (regCount === 0) {
      await Registration.insertMany(seedRegistrations);
      console.log('Seeded Registrations collection');
    }
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
}

module.exports = {
  seedEvents,
  seedClubs,
  seedStudents,
  seedRegistrations,
  seedDatabase
};
