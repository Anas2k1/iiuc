const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  day: { type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  time: { type: String, required: true }, // Format: "09:00 - 10:30"
  course: { type: String, required: true },
  teacher: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  block: { type: String, required: true }, // Block number (A, B, C, D)
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
