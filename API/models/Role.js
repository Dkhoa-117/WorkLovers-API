const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    roleName: {
        type: String,
        required: true
    },
    corfficient: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Role', RoleSchema);