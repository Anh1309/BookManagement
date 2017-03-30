const path = require('path');
const User = require('../models/User');
const Utils = require('../helpers/Utils');
const async = require('async');
const crypto = require('crypto');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

function showRegister(req, res, next) {
    res.render('pages/auth/register');
}

function register(req, res, next) {
    var newUser = new User(req.body);
    Utils.saltAndHash(newUser.password, function (err, result) {
        newUser.password = result;
        newUser.id = Utils.getUUID();
        newUser.save(function (error) {
            if (error) {
                return Utils.getStringErrors(error.errors, function(err, message){
                    if (err) {
                        return res.json(err);
                    } else {
                        var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                        req.flash('reason_fail', errMessage.message);
                        res.redirect('/auth/register');
                    }
                });
            } else {
                res.redirect('/auth/login');
            }
        });
    });

}

function showLogin(req, res, next) {
    res.render('pages/auth/login');
}

function login(req, res, next) {
    User.findOne({'email': req.body.email}, function (err, user) {
        if (err) {
            return res.json(err);
        } else {
            if (!user) {
                req.flash('reason_fail', 'User not exist. Please check your email.');
                res.redirect('/auth/login');
            } else {
                if (user.is_active === false) {
                    req.flash('reason_fail', 'User has been deleted');
                    res.redirect('/auth/login');
                } else {
                    Utils.checkPassword(req.body.password, user.password, function(err, result){
                        if (err) {
                            return res.json(err);
                        } else {
                            if (!result) {
                                req.flash('reason_fail', 'Wrong password. Please check your password.');
                                res.redirect('/auth/login');
                            } else {
                                req.session.user = user;
                                res.redirect('/auth/profile');
                            }
                        }
                    });
                }
                
            }
        }
    });
}

function showProfile(req, res, next) {
    res.render('pages/auth/profile');
}

function user(req, res, next) {
    res.render('pages/user/user-list');
}

function getUserList(req, res, next) {
    User.find({role: 'NORMAL USER', is_active: true}, function(err, filteredUsers){
        if (err) {
            return res.json(err);
        } else {
            var users = [];
            var start = parseInt(req.body.start);
            var length = parseInt(req.body.length);
            for (var i = 0; i < start + length && i < filteredUsers.length; i++) {
                users.push(filteredUsers[i]);
            }
            res.json({
                "recordsTotal": filteredUsers.length,
                "recordsFiltered": filteredUsers.length,
                "data": users
            });
        }
    });
}

function deleteUser(req, res, next) {
    for (var i = 0; i < req.body.countUser; i++) {
        User.findOne({id: req.body.listUserId.split(';')[i]}, function(err, user){
            if (err) {
                return res.json(err);
            } else {
                user.is_active = false;
                user.save(function(err, deletedUser){
                    if (err) {
                        return res.json(err);
                    }
                });
            }
        });
    }
    res.redirect('/user/user-list');
}

function logout(req, res, next) {
    req.session.user = null;
    res.redirect('/auth/login');
}

function changeUsername(req, res, next) {
    User.findOne({id: req.session.user.id}, function(err, user){
        if (err) {
            return res.json(err);
        } else {
            user.username = req.body.username;
            user.save(function(error, updatedUser){
                if (error) {
                    return Utils.getStringErrors(error.errors, function(err, message) {
                        if (err) {
                            return res.json(err);
                        } else {
                            var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                            req.flash('reason_fail', errMessage.message);
                            res.redirect('/auth/profile');
                        }
                    });
                } else {
                    req.session.user = updatedUser;
                    req.flash('success', 'Username has been changed');
                    res.redirect('/auth/profile');
                }
            });
            
        }
    });
}

function changeEmail(req, res, next) {
    User.findOne({id: req.session.user.id}, function(err, user){
        if (err) {
            return res.json(err);
        } else {
            user.email = req.body.email;
            user.save(function(error, updatedUser){
                if (error) {
                    return Utils.getStringErrors(error.errors, function(err, message) {
                        if (err) {
                            return res.json(err);
                        } else {
                            var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                            req.flash('reason_fail', errMessage.message);
                            res.redirect('/auth/profile');
                        }
                    });
                } else {
                    req.session.user = updatedUser;
                    req.flash('success', 'Email has been changed');
                    res.redirect('/auth/profile');
                }
            });
            
        }
    });
}

function changePassword(req, res, next) {
    Utils.checkPassword(req.body.oldPassword, req.session.user.password, function(err, result){
        if (err) {
            return res.json(err);
        } else {
            if (!result) {
                req.flash('reason_fail', 'Wrong password');
                res.redirect('/auth/profile');
            } else {
                User.findOne({id: req.session.user.id}, function(err, user){
                    if (err) {
                        return res.json(err);
                    } else {
                        Utils.saltAndHash(req.body.newPassword, function(err, newPassword){
                            user.password = newPassword;
                            user.save(function(err, updatedUser){
                                if (err) {
                                    return res.json(err);
                                } else {
                                    req.session.user = user;
                                    req.flash('success', 'Password has been changed');
                                    res.redirect('/auth/profile');
                                }
                            });
                            
                        });
                    }
                });
            }
        }
    });
}

function showForgotPassword(req, res, next) {
    res.render('pages/auth/forgot-password');
}

function forgotPassword(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        }, function(token, done) {
            User.findOne({email: req.body.email}, function(err, user) {
                if (err) {
                    return res.json(err);
                } else {
                    if (!user || !user.is_active) {
                        req.flash('reason_fail', 'User is not exist');
                        res.redirect('/auth/forgot-password');
                    } else {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000;
                        user.save(function(err){
                            done(err, token, user);
                        });
                    }
                }
            });
        }, function(token, user, done) {
            var mailOptions = {
                to: user.email,
                from: '<anhle130994@gmail.com>',
                subject: 'Password reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/auth/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            Utils.sendNodeMailer(mailOptions, function(err) {
                if (err) {
                    return res.json(err);
                } else {
                    done(err, 'done');
                }
            });
        }
    ], function(err) {
        if (err) {
            return res.json(err);
        } else {
            res.redirect('/auth/forgot-password');
        }
    });
}

function showResetPassword(req, res, next) {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user) {
        if (err) {
            return res.json(err);
        } else {
            if (!user || !user.is_active) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                res.redirect('/auth/forgot-password');
            } else {
                res.render('pages/auth/reset-password', {token: req.params.token});
            }
        }
    });
}

function resetPassword(req, res, next) {
    User.findOne({resetPasswordToken: req.body.token}, function(err, user) {
        if (err) {
            return res.json(err);
        } else {
            if (!user || !user.is_active) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                res.redirect('back');
            } else {
                Utils.saltAndHash(req.body.password, function(err, result) {
                    if (err) {
                        return res.json(err);
                    } else {
                        user.password = result;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function(err) {
                            if (err) {
                                return res.json(err);
                            }
                        });
                        res.redirect('/auth/login');
                    }
                });
            }
        }
    });
}

module.exports = {
    showRegister: showRegister,
    showLogin: showLogin,
    register: register,
    login: login,
    showProfile: showProfile,
    user: user,
    getUserList: getUserList,
    deleteUser: deleteUser,
    logout: logout,
    changeUsername: changeUsername,
    changeEmail: changeEmail,
    changePassword: changePassword,
    showForgotPassword: showForgotPassword,
    forgotPassword: forgotPassword,
    showResetPassword: showResetPassword,
    resetPassword: resetPassword
};