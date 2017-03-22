const mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    category_id: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    public_date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
});

module.exports = mongoose.model('Book', BookSchema);