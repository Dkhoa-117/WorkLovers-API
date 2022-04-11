const mongoose = require('mongoose')

const DayoffSchema = mongoose.Schema({
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    period: {
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        },
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Dayoff', DayoffSchema);