const Schedule = require('../models/Schedule');

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
