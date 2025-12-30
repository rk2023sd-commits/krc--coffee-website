const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        const wishlist = user.wishlist || [];

        res.status(200).json({
            success: true,
            count: wishlist.length,
            data: wishlist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user.id);
        if (!user.wishlist) user.wishlist = [];

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        user.wishlist.push(productId);
        console.log('Saving user with wishlist:', user.wishlist);
        await user.save();
        console.log('User saved successfully');

        res.status(200).json({
            success: true,
            data: user.wishlist,
            message: 'Product added to wishlist'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user.id);
        if (!user.wishlist) user.wishlist = [];

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        // Return the updated populated list so frontend updates immediately
        const updatedUser = await User.findById(req.user.id).populate('wishlist');

        res.status(200).json({
            success: true,
            data: updatedUser.wishlist,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
