const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
