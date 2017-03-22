const mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    id: {
        type:String,
        required: true,
        unique: true
    },
    name: {
        type: String
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

module.exports = mongoose.model('Category', CategorySchema);