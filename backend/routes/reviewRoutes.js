const express = require('express');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getProductReviews)
    .post(protect, createReview);

module.exports = router;
