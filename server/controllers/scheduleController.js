const Schedule = require('../models/Schedule');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('room bookings');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoutine = async (req, res) => {
  try {
    const { routineData } = req.body; // Array of routine entries
    
    if (!Array.isArray(routineData) || routineData.length === 0) {
      return res.status(400).json({ message: 'Invalid routine data' });
    }

    // Clear existing schedules
    await Schedule.deleteMany({});
    await Booking.deleteMany({});

    // Create new schedules and auto-book rooms
    const createdSchedules = [];
    const autoBookings = [];

    for (const routine of routineData) {
      const { day, time, course, teacher, roomId, block } = routine;

      // Validate required fields
      if (!day || !time || !course || !teacher || !roomId || !block) {
        return res.status(400).json({ message: 'Missing required fields in routine data' });
      }

      // Create schedule
      const schedule = new Schedule({
        day,
        time,
        course,
        teacher,
        room: roomId,
        block,
        updatedAt: new Date()
      });

      await schedule.save();
      createdSchedules.push(schedule);

      // Auto-book room for this time slot
      // Get the next occurrence of this day
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
      const today = new Date();
      const currentDayIndex = today.getDay();
      let daysUntilScheduleDay = dayIndex - currentDayIndex;
      
      if (daysUntilScheduleDay < 0) {
        daysUntilScheduleDay += 7; // Next week
      }
      if (daysUntilScheduleDay === 0) {
        // Check if we should book for today or next week
        const [startTimeStr] = time.split(' - ');
        const [hours, minutes] = startTimeStr.split(':').map(Number);
        const scheduleTime = new Date();
        scheduleTime.setHours(hours, minutes, 0);
        
        if (scheduleTime <= today) {
          daysUntilScheduleDay = 7; // Next week
        }
      }

      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + daysUntilScheduleDay);
      bookingDate.setHours(0, 0, 0, 0);

      // Get or create a system admin user for auto-bookings
      let systemUser = await User.findOne({ email: 'system@admin.com' });
      if (!systemUser) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('system-password', 10);
        systemUser = new User({
          name: 'System Admin',
          email: 'system@admin.com',
          password: hashedPassword,
          role: 'teacher',
          status: 'approved',
          isVerified: true
        });
        await systemUser.save();
      }

      const booking = new Booking({
        user: systemUser._id,
        room: roomId,
        date: bookingDate,
        timeSlot: time
      });

      await booking.save();
      schedule.bookings.push(booking._id);
      await schedule.save();
      autoBookings.push(booking);
    }

    res.status(200).json({
      message: 'Routine updated successfully',
      schedules: createdSchedules,
      bookings: autoBookings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
