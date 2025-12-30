const express = require('express');
const { getSalesReport, getRevenueReport, getProductPerformance } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/sales', getSalesReport);
router.get('/revenue', getRevenueReport);
router.get('/performance', getProductPerformance);

module.exports = router;
