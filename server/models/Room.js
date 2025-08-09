const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true },
  image: { type: String },
  block: { type: String, required: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  floor: { type: Number, default: 1 },
  hasWifi: { type: Boolean, default: false },
  hasProjector: { type: Boolean, default: false },
  nextAvailable: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
