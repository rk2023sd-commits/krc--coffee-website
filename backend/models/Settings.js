const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true, // e.g., 'payment', 'tax', 'notification'
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Stores structure depending on settings type
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
