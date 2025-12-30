const FAQ = require('../models/FAQ');
const Contact = require('../models/Contact');
const Settings = require('../models/Settings');

// --- FAQs ---

// @desc    Get active FAQs (Public)
// @route   GET /api/cms/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: faqs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/cms/admin/faqs
// @access  Private/Admin
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({}).sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, data: faqs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create FAQ
// @route   POST /api/cms/admin/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update FAQ
// @route   PUT /api/cms/admin/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
        res.status(200).json({ success: true, data: faq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete FAQ
// @route   DELETE /api/cms/admin/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'FAQ deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Contact ---

// @desc    Submit Contact Form
// @route   POST /api/cms/contact
// @access  Public
exports.submitContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Contact Submissions (Admin)
// @route   GET /api/cms/admin/contact
// @access  Private/Admin
exports.getContactSubmissions = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Pages (Stored in Settings) ---

// @desc    Get Page Content (Public)
// @route   GET /api/cms/pages/:type
// @access  Public
exports.getPageContent = async (req, res) => {
    try {
        // Types: 'about', 'contact_info', 'privacy', 'terms'
        const { type } = req.params;
        const setting = await Settings.findOne({ type });
        // Return active data or empty
        res.status(200).json({ success: true, data: setting ? setting.data : {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update Page Content (Admin)
// @route   PUT /api/cms/admin/pages/:type
// @access  Private/Admin
exports.updatePageContent = async (req, res) => {
    try {
        const { type } = req.params;
        const { data } = req.body;

        // Upsert
        const setting = await Settings.findOneAndUpdate(
            { type },
            { type, data },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.status(200).json({ success: true, data: setting.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
