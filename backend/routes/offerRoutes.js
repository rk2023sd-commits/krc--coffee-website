const express = require('express');
const { getOffers, createOffer, deleteOffer, toggleOfferStatus } = require('../controllers/offerController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: View offers (with optional auth for used check)
router.route('/')
    .get(optionalProtect, getOffers)
    .post(protect, createOffer);

router.route('/:id')
    .delete(protect, deleteOffer);

router.put('/:id/toggle', protect, toggleOfferStatus);

module.exports = router;
