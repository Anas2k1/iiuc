const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  capacity: { type: Number, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', RoomSchema);
