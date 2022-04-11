const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // address: [{
    //     street: String,
    //     city: String,
    //     district: String,
    //     wards: String,
    // }],
    address:{
        type: String
    },
    cccd: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    maxDateOff: {
        type: Number,
        default: 15,
        max: 15,
        min: 0
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"]
    },
    isBoss: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ""
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model('User', UserSchema);
