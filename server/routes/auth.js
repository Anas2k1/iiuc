const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

// Admin-only routes
router.get('/pending-users', authMiddleware, authController.getPendingUsers);
router.put('/approve/:userId', authMiddleware, authController.approveUser);
router.put('/reject/:userId', authMiddleware, authController.rejectUser);
router.get('/all-users', authMiddleware, authController.getAllUsers);
router.delete('/delete/:userId', authMiddleware, authController.deleteUser);
router.put('/update/:userId', authMiddleware, authController.updateUser);

module.exports = router;
