const express = require('express');
const {
    getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ,
    submitContact, getContactSubmissions,
    getPageContent, updatePageContent
} = require('../controllers/cmsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/faqs', getFAQs);
router.post('/contact', submitContact);
router.get('/pages/:type', getPageContent);

// Admin Routes (Protected)
router.use('/admin', protect); // Apply protect to all /admin/* routes? 
// Actually router.use applies to middleware. 
// I can do: router.get('/admin/faqs', protect, getAllFAQs);
// Or cleaner:

// Admin FAQs
router.get('/admin/faqs', protect, getAllFAQs);
router.post('/admin/faqs', protect, createFAQ);
router.put('/admin/faqs/:id', protect, updateFAQ);
router.delete('/admin/faqs/:id', protect, deleteFAQ);

// Admin Contact
router.get('/admin/contact', protect, getContactSubmissions);

// Admin Pages
router.put('/admin/pages/:type', protect, updatePageContent);

module.exports = router;
