const Student = require('../models/Student');

// REST API: Get all students (sanitized: hides sensitive internal fields)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, '-phone').sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students',
      error: error.message
    });
  }
};

// REST API: Get single student by studentId or _id
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    let student = await Student.findOne({ studentId: id }, '-phone');
    if (!student && id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id, '-phone');
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student',
      error: error.message
    });
  }
};

// REST API: Create student
exports.createStudent = async (req, res) => {
  try {
    const {
      studentId, name, email, phone, department, year, section, interests, profileImage
    } = req.body;

    if (!studentId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: studentId, name, email'
      });
    }

    const existing = await Student.findOne({
      $or: [{ studentId }, { email: email.toLowerCase() }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Student with this ID or Email already exists'
      });
    }

    const newStudent = await Student.create({
      studentId,
      name,
      email: email.toLowerCase(),
      phone: phone || '0000000000',
      department: department || 'Computer Science & Engineering',
      year: Number(year) || 3,
      section: section || 'A',
      interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map(i => i.trim()) : ['Tech', 'Innovation']),
      profileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating student',
      error: error.message
    });
  }
};

// REST API: Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    let student = await Student.findOne({ studentId: id });
    if (!student && id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found: ${id}`
      });
    }

    const updated = await Student.findOneAndUpdate(
      { _id: student._id },
      { $set: req.body },
      { new: true, runValidators: true, select: '-phone' }
    );

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating student',
      error: error.message
    });
  }
};

// REST API: Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    let student = await Student.findOne({ studentId: id });
    if (!student && id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id);
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found: ${id}`
      });
    }

    await Student.deleteOne({ _id: student._id });
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student',
      error: error.message
    });
  }
};

// ==========================================
// SERVER-SIDE RENDERED VIEWS
// ==========================================

// SSR: Student Profiles Page
exports.renderStudentsPage = async (req, res, next) => {
  try {
    const students = await Student.find({}, '-phone').sort({ name: 1 });
    res.render('students', {
      pageTitle: 'Student Community — Campusly',
      activeNav: 'students',
      students
    });
  } catch (error) {
    next(error);
  }
};
