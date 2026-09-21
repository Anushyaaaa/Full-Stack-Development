const Club = require('../models/Club');

// REST API: Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');

    const clubs = await Club.find(filter).sort({ members: -1 });
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching clubs',
      error: error.message
    });
  }
};

// REST API: Get single club by clubId or _id
exports.getClubById = async (req, res) => {
  try {
    const { id } = req.params;
    let club = await Club.findOne({ clubId: id });
    if (!club && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(id);
    }

    if (!club) {
      return res.status(404).json({
        success: false,
        message: `Club not found with identifier: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: club
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching club',
      error: error.message
    });
  }
};

// REST API: Create club
exports.createClub = async (req, res) => {
  try {
    const {
      clubId, name, description, category, president, facultyCoordinator,
      members, email, image, meetingDay, meetingTime, location
    } = req.body;

    if (!clubId || !name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: clubId, name, description'
      });
    }

    const existing = await Club.findOne({ clubId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Club with clubId ${clubId} already exists`
      });
    }

    const newClub = await Club.create({
      clubId,
      name,
      description,
      category: category || 'Technical',
      president: president || 'Student President',
      facultyCoordinator: facultyCoordinator || 'Faculty Coordinator',
      members: Number(members) || 0,
      email: email || 'club@campus.edu',
      image: image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      meetingDay: meetingDay || 'Friday',
      meetingTime: meetingTime || '4:00 PM',
      location: location || 'Innovation Lab'
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: newClub
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating club',
      error: error.message
    });
  }
};

// REST API: Update club
exports.updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    let club = await Club.findOne({ clubId: id });
    if (!club && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(id);
    }

    if (!club) {
      return res.status(404).json({
        success: false,
        message: `Club not found: ${id}`
      });
    }

    const updated = await Club.findOneAndUpdate(
      { _id: club._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating club',
      error: error.message
    });
  }
};

// REST API: Delete club
exports.deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    let club = await Club.findOne({ clubId: id });
    if (!club && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(id);
    }

    if (!club) {
      return res.status(404).json({
        success: false,
        message: `Club not found: ${id}`
      });
    }

    await Club.deleteOne({ _id: club._id });
    res.status(200).json({
      success: true,
      message: 'Club deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting club',
      error: error.message
    });
  }
};

// ==========================================
// SERVER-SIDE RENDERED VIEWS
// ==========================================

// SSR: Clubs Directory Page
exports.renderClubsPage = async (req, res, next) => {
  try {
    const clubs = await Club.find().sort({ members: -1 });
    res.render('clubs', {
      pageTitle: 'Discover Clubs — Campusly',
      activeNav: 'clubs',
      clubs
    });
  } catch (error) {
    next(error);
  }
};

// SSR: Club Details Page
exports.renderClubDetailsPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let club = await Club.findOne({ clubId: id });
    if (!club && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(id);
    }

    if (!club) {
      return res.status(404).render('404', {
        pageTitle: 'Club Not Found — Campusly',
        activeNav: 'clubs',
        message: `We couldn't find the club with identifier "${id}".`
      });
    }

    res.render('club-details', {
      pageTitle: `${club.name} — Campusly`,
      activeNav: 'clubs',
      club
    });
  } catch (error) {
    next(error);
  }
};
