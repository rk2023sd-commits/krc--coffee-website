const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Verification = require('../models/Verification');
const { logEvent } = require('../utils/logger'); // Import Logger

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

        // Log success
        await logEvent('info', `New user registered: ${user.name} (${user.role})`, { email: user.email }, user._id, req.ip);

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

        // Log login
        await logEvent('info', `User logged in: ${user.name}`, { role: user.role }, user._id, req.ip);

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
// @desc    Send Verification OTP
// @route   POST /api/auth/send-verification
// @access  Public
exports.sendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    try {
        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already registered with this email' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`DEV ONLY: OTP for ${email} is ${otp}`);
        require('fs').writeFileSync('otp.txt', otp);

        // Save OTP to DB (upsert)
        await Verification.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send OTP Email
        try {
            await sendEmail({
                email,
                subject: 'KRC! Coffee - Email Verification Code',
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4A2C2A;">Verify Your Email</h2>
                        <p>Use the following code to verify your email address for KRC! Coffee registration:</p>
                        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                            <h1 style="color: #C97E45; margin: 0; letter-spacing: 5px;">${otp}</h1>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                `
            });

            res.status(200).json({ success: true, message: 'Verification code sent to your email' });
        } catch (emailErr) {
            console.error('Verification email failed:', emailErr);
            return res.status(500).json({ success: false, message: 'Failed to send verification email' });
        }

    } catch (error) {
        console.error('Send Verification Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    try {
        const record = await Verification.findOne({ email });

        if (!record) {
            return res.status(400).json({ success: false, message: 'Verification code expired or not found' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Verification successful
        // Send "Welcome" message as requested by user ("verify ke liye jo email real hai to email pe welcome massage jayega")
        try {
            await sendEmail({
                email,
                subject: 'Email Verified - Welcome to KRC! Coffee',
                message: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4A2C2A;">Email Verified!</h2>
                        <p>Your email address has been successfully verified.</p>
                        <p>You can now proceed to complete your registration.</p>
                        <p>Welcome to the <strong>KRC! Coffee</strong> family!</p>
                    </div>
                `
            });
        } catch (err) {
            console.error('Post-verification welcome email failed:', err);
            // Don't fail the verification just because welcome email failed
        }

        // Delete the verification record to prevent reuse (or keep it if we need to check during register)
        // For now, let's delete it to keep it clean.
        await Verification.deleteOne({ email });

        res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify OTP and Update Email
// @route   POST /api/auth/verify-email-change
// @access  Private
exports.verifyEmailChange = async (req, res) => {
    const { email, otp } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide new email and OTP' });
    }

    try {
        const record = await Verification.findOne({ email });

        if (!record) {
            return res.status(400).json({ success: false, message: 'Verification code expired or not found' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' });
        }

        // Update User Email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if email already taken by ANOTHER user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ success: false, message: 'Email already in use by another account' });
        }

        user.email = email;
        await user.save();

        // Delete verification record
        await Verification.deleteOne({ email });

        res.status(200).json({ success: true, message: 'Email updated successfully', data: { email: user.email } });

    } catch (error) {
        console.error('Verify Email Change Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
