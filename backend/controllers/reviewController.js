const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private (Customer)
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({
            product: productId,
            user: req.user._id
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
