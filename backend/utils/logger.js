const Log = require('../models/Log');

/**
 * Logs a system event to the database.
 * @param {string} type - 'info', 'warning', 'error', 'success'
 * @param {string} message - Short description
 * @param {Object} [details] - Optional additional data
 * @param {string} [userId] - Optional User ID associated with the event
 * @param {string} [ip] - Optional IP address
 */
const logEvent = async (type, message, details = {}, userId = null, ip = null) => {
    try {
        await Log.create({
            type,
            message,
            details,
            user: userId,
            ip
        });
    } catch (err) {
        console.error('Failed to write system log:', err.message);
        // Do not throw error to prevent disrupting the main flow
    }
};

module.exports = { logEvent };
