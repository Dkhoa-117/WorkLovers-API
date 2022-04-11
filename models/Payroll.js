const mongoose = require('mongoose');

const PayrollSchema = mongoose.Schema({
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    wage: {
        type: Number,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    },
    dayoff_count: {
        type: Number,
        required: true,
        default: 0
    },
    detail: {
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Payroll', PayrollSchema);