const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.get('/', auth, bookingController.getBookings);
router.post('/', auth, bookingController.createBooking);
router.delete('/:id', auth, bookingController.deleteBooking);

module.exports = router;
