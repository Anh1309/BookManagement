const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var CategorySchema = new mongoose.Schema({
    id: {
        type:String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
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
CategorySchema.plugin(uniqueValidator,  { message: 'Expected {PATH} cannot be duplicated.' });
module.exports = mongoose.model('Category', CategorySchema);