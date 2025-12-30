const express = require('express');
const { getOffers, createOffer, deleteOffer, toggleOfferStatus } = require('../controllers/offerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: View offers
router.route('/')
    .get(getOffers)
    .post(protect, createOffer);

router.route('/:id')
    .delete(protect, deleteOffer);

router.put('/:id/toggle', protect, toggleOfferStatus);

module.exports = router;
