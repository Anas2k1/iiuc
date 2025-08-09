exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user room');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { room, date, timeSlot } = req.body;
    // Conflict detection: check for existing booking for same room/date/timeSlot
    const conflict = await Booking.findOne({
      room,
      date,
      timeSlot
    });
    if (conflict) {
      return res.status(400).json({ message: 'Room already booked for this time slot.' });
    }
    const bookingData = {
      ...req.body,
      user: req.user, // set user from JWT
    };
  const booking = new Booking(bookingData);
  await booking.save();
  // Set room status to 'occupied'
  await Room.findByIdAndUpdate(room, { status: 'occupied' });
  res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (booking) {
      // Set room status back to 'vacant' if this was the only booking for that room
      const otherBookings = await Booking.find({ room: booking.room });
      if (otherBookings.length === 0) {
        await Room.findByIdAndUpdate(booking.room, { status: 'vacant' });
      }
    }
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
