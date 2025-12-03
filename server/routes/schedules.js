const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

router.get('/', auth, scheduleController.getSchedules);
router.post('/', auth, scheduleController.createSchedule);
router.put('/update-routine', auth, scheduleController.updateRoutine);

module.exports = router;
