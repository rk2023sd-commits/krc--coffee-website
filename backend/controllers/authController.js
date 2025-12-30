const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    console.log('Register Request Body:', JSON.stringify(req.body, null, 2));

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({
            name,
            email,
            phone,
            password,
            role
        });

        // Create Welcome Notification
        console.log('Checkpoint: User created, ID:', user._id);

        try {
            await Notification.create({
                user: user._id,
                title: 'Welcome to KRC! Coffee ☕',
                message: `Hello ${user.name}, thank you for joining our community! Enjoy your premium coffee journey.`,
                type: 'account'
            });
            console.log('Checkpoint: Notification created');
        } catch (notifErr) {
            console.error('Welcome notification failed:', notifErr.message);
        }

        // Send Welcome Email
        try {
            console.log('Checkpoint: Attempting to send email to', user.email);
            await sendEmail({
                email: user.email,
                subject: 'Welcome to KRC! Coffee ☕',
                message: `<h1>Welcome to KRC! Coffee</h1>
                          <p>Hi ${user.name},</p>
                          <p>Thank you for joining us! We are excited to serve you the best coffee.</p>
                          <p>Login to your account to start ordering.</p>`
            });
            console.log('Checkpoint: Email sent');
        } catch (emailErr) {
            console.error('Welcome email failed:', emailErr.message);
            console.error(emailErr); // Log full email error
            // We don't stop the registration if email fails
        }

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Registration Main Catch Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message, stack: error.stack });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
