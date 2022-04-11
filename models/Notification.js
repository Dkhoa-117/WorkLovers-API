const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high", "none"]
    },
    view: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Notification', NotificationSchema);