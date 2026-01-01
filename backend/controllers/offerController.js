const User = require('../models/User'); // Import User model
const Offer = require('../models/Offer');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private/Admin
exports.getOffers = async (req, res) => {
    try {
        // Fetch all active offers
        // We use lean() to get plain objects so we can attach properties
        const offers = await Offer.find({}).sort('-createdAt').lean();

        // If user is logged in (and not admin), check which ones are used
        if (req.user && req.user.role !== 'admin') {
            const user = await User.findById(req.user.id);
            if (user && user.usedCoupons) {
                offers.forEach(offer => {
                    // Check if offer ID is in user's usedCoupons
                    if (user.usedCoupons.some(id => id.toString() === offer._id.toString())) {
                        offer.isUsed = true; // Attach flag
                    }
                });
            }
        }

        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res) => {
    try {
        const offer = await Offer.create(req.body);
        res.status(201).json({ success: true, data: offer });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Offer code already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }
        await offer.deleteOne();
        res.status(200).json({ success: true, message: 'Offer deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle offer status
// @route   PUT /api/offers/:id/toggle
// @access  Private/Admin
exports.toggleOfferStatus = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }
        offer.isActive = !offer.isActive;
        await offer.save();
        res.status(200).json({ success: true, data: offer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
