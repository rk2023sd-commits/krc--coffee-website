const User = require('../models/User');

// @desc    Get all customers
// @route   GET /api/users/customers
// @access  Private/Admin
exports.getCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all staff/admins
// @route   GET /api/users/staff
// @access  Private/Admin
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: 'customer' } }).select('-password'); // Fetching non-customers as staff
        res.status(200).json({
            success: true,
            count: staff.length,
            data: staff
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add address
// @route   POST /api/users/address
// @access  Private
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.addresses.push(req.body);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete address
// @route   DELETE /api/users/address/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.addresses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get user reward points
// @route   GET /api/users/rewards
// @access  Private
exports.getRewards = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            rewardPoints: user.rewardPoints || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { cardType, last4, expiry, cardHolder, isPrimary } = req.body;

        if (isPrimary) {
            user.paymentMethods.forEach(pm => { pm.isPrimary = false; });
        }

        user.paymentMethods.push({
            cardType,
            last4,
            expiry,
            cardHolder,
            isPrimary: isPrimary || user.paymentMethods.length === 0
        });

        await user.save();

        res.status(200).json({
            success: true,
            data: user.paymentMethods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
exports.deletePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.paymentMethods = user.paymentMethods.filter(pm => pm._id.toString() !== req.params.id);
        await user.save();

        res.status(200).json({
            success: true,
            data: user.paymentMethods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get payment methods
// @route   GET /api/users/payment-methods
// @access  Private
exports.getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user.paymentMethods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update payment method
// @route   PUT /api/users/payment-methods/:id
// @access  Private
exports.updatePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const pm = user.paymentMethods.id(req.params.id);
        if (!pm) {
            return res.status(404).json({ success: false, message: 'Payment method not found' });
        }

        const { expiry, isPrimary } = req.body;
        if (expiry) pm.expiry = expiry;
        if (isPrimary !== undefined) {
            if (isPrimary) {
                user.paymentMethods.forEach(p => p.isPrimary = false); // Reset others
            }
            pm.isPrimary = isPrimary;
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user.paymentMethods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

