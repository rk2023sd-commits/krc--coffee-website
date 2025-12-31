const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // Assuming frontend is running on different port/domain or same domain handled by proxy
        // For development, we might use hardcoded localhost or derive it.
        // Let's rely on req.get('host') if we are serving backend/frontend together,
        // OR better yet, let's make it configurable or standard.
        // Since this is a MERN app mostly separated, the link should point to the frontend route.
        // I will assume standard frontend URL logic (using REFERER or Origin if available, or fallback to sensible default).
        // Actually, usually in these tasks, I should point it to the frontend URL.
        // I'll try to guess based on standard setups, e.g. http://localhost:5173/reset-password/:token

        let frontendUrl = 'http://localhost:5173'; // Default Vite port
        if (req.headers.origin && req.headers.origin.includes('localhost')) {
            frontendUrl = req.headers.origin;
        }

        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please make a PUT request to the following link:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
