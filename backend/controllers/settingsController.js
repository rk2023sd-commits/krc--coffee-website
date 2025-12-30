const Settings = require('../models/Settings');

// @desc    Get Settings by Type
// @route   GET /api/settings/:type
// @access  Private/Admin
exports.getSettings = async (req, res) => {
    try {
        const type = req.params.type;
        let settings = await Settings.findOne({ type });

        if (!settings) {
            // Return empty default structure if not found to avoid null errors on frontend
            return res.status(200).json({ success: true, data: {} });
        }

        res.status(200).json({ success: true, data: settings.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update Settings
// @route   PUT /api/settings/:type
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        const type = req.params.type;
        const data = req.body;

        const settings = await Settings.findOneAndUpdate(
            { type },
            { type, data },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.status(200).json({ success: true, data: settings.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get System Logs (Mocked for now as we don't have a real logger to DB yet)
// @route   GET /api/settings/logs/system
// @access  Private/Admin
exports.getSystemLogs = async (req, res) => {
    try {
        // In a real app, this would query a Logs collection
        const mockLogs = [
            { id: 1, type: 'info', message: 'System backup completed successfully', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
            { id: 2, type: 'warning', message: 'High memory usage detected', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
            { id: 3, type: 'error', message: 'Failed payment webhook delivery', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
            { id: 4, type: 'info', message: 'Admin user login', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        ];
        res.status(200).json({ success: true, data: mockLogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
