const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String,
        unique: true
    }, 
    username: {
        required: true,
        type: String,
        unique: true
    }, 
    email: {
        required: true,
        type: String,
        unique: true
    }, 
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        default: "NORMAL USER"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', UserSchema);