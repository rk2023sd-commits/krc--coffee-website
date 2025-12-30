const express = require('express');
const { getSettings, updateSettings, getSystemLogs } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/logs/system', getSystemLogs); // Specific route before generic :type
router.get('/:type', getSettings);
router.put('/:type', updateSettings);

module.exports = router;
