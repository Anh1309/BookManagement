const mongoose = require('mongoose');
const config = require('./config/config');

const app = require('./config/express');

mongoose.connect('localhost:27017/test');
db = mongoose.connection;

db.on('error', function () {
    throw new Error('Unable to connect to MongoDB');
});

db.on('connected', function () {
    console.log('Connected to MongoDB at localhost:27017/test');
});

app.listen(config.port, function(){
    console.log("Server start on port 3000");
});

module.exports = app;
