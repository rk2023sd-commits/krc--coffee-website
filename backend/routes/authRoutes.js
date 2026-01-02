const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, sendVerification, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/send-verification', sendVerification);
router.post('/verify-otp', verifyOtp);

module.exports = router;
