const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: Object, // Flexible field for stack traces or request bodies
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    ip: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', logSchema);
