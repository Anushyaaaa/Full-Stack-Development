const Event = require('../models/Event');

// REST API: Get all event venues and geolocation details
exports.getAllVenues = async (req, res) => {
  try {
    const events = await Event.find({}, 'eventId title venue address latitude longitude mapUrl');
    
    const venues = events.map(evt => ({
      eventId: evt.eventId,
      eventTitle: evt.title,
      venue: evt.venue,
      address: evt.address,
      latitude: evt.latitude,
      longitude: evt.longitude,
      mapUrl: evt.mapUrl || `https://www.google.com/maps/search/?api=1&query=${evt.latitude},${evt.longitude}`
    }));

    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching venue locations',
      error: error.message
    });
  }
};

// REST API: Get venue location for a specific event
exports.getVenueByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    let event = await Event.findOne({ eventId });
    if (!event && eventId.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(eventId);
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event with ID "${eventId}" not found`
      });
    }

    const lat = event.latitude || 12.9716;
    const lng = event.longitude || 77.5946;
    const mapUrl = event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    res.status(200).json({
      success: true,
      data: {
        eventId: event.eventId,
        eventTitle: event.title,
        venue: event.venue,
        address: event.address,
        latitude: lat,
        longitude: lng,
        mapUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching venue location',
      error: error.message
    });
  }
};
