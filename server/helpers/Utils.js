const bcrypt = require("bcrypt-nodejs");
const uuidV4 = require('uuid/v4');
const async = require('async');

// generate a UUID V4 string base64 encoded and url safe
function getUUID() {
   const buffer = new Buffer(16);
    uuidV4(null, buffer, 0);
    var origin64 = buffer.toString('base64');
    // remove the equal signs, replace / with _, replace + with -
    var edited64 = origin64.replace(/\=/g, "").replace(/\//g, '_').replace(/\+/g, '-');
    return edited64;
}

const SALT_FACTOR = 10;
const noop = function() {};

function saltAndHash(password, done) {
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
        bcrypt.hash(password, salt, noop, function(err, hashedPassword) {
            if (err) { return done(err); }
            done(null, hashedPassword);
        });
    });
}

function checkPassword(guess, hashedPassword, done) {
    bcrypt.compare(guess, hashedPassword, function(err, isMatch) {
        done(err, isMatch);
    });
}

function getStringErrors(errors, done) {
    async.waterfall([
        function (callback) {
            var messages = [];
            for (var key in errors) {
                messages.push(errors[key].message);
            }
            
            callback(null, messages);
        }, function (messages, callback) {
            var message = messages.join("\n");
    
            callback(null, message);
        }
    ], function (err, result) {
        if (err)
            return done(err);
        else
            return done(null, result);
    });
}
module.exports = {
    getUUID: getUUID,
    saltAndHash: saltAndHash,
    checkPassword: checkPassword,
    getStringErrors: getStringErrors
};