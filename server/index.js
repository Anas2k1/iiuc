const express = require('express');
const cron = require('node-cron');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const scheduleRoutes = require('./routes/schedules');

const app = express();

// Scheduled job to set rooms to 'vacant' after booking end time
const Booking = require('./models/Booking');
const Room = require('./models/Room');

// Helper: parse timeSlot (e.g., '10:00-12:00') to end time
function getEndTime(date, timeSlot) {
  if (!timeSlot) return null;
  const [start, end] = timeSlot.split('-');
  if (!end) return null;
  const [endHour, endMinute] = end.split(':').map(Number);
  const endDate = new Date(date);
  endDate.setHours(endHour, endMinute, 0, 0);
  return endDate;
}

// Runs every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    // Find all rooms marked as occupied
    const occupiedRooms = await Room.find({ status: 'occupied' });
    for (const room of occupiedRooms) {
      // Find all bookings for this room
      const bookings = await Booking.find({ room: room._id });
      // If no bookings, set to vacant
      if (bookings.length === 0) {
        await Room.findByIdAndUpdate(room._id, { status: 'vacant' });
        continue;
      }
      // Check if any booking is still active (end time in future)
      const now = new Date();
      const hasActive = bookings.some(b => {
        const endTime = getEndTime(b.date, b.timeSlot);
        return endTime && endTime > now;
      });
      if (!hasActive) {
        await Room.findByIdAndUpdate(room._id, { status: 'vacant' });
      }
    }
  } catch (err) {
    console.error('Error in room status cron job:', err);
  }
});
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/schedules', scheduleRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
