const path = require('path');
const User = require('../models/User');
const Utils = require('../helpers/Utils');

function showRegister(req, res, next) {
    res.render('pages/auth/register');
}

function register(req, res, next) {
    var newUser = new User(req.body);
    Utils.saltAndHash(newUser.password, function (err, result) {
        newUser.password = result;
        newUser.id = Utils.getUUID();
        newUser.save(function (err, result) {
            if (err) {
                return res.json(err);
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
                
                Utils.checkPassword(req.body.password, user.password, function(err, result){
                    if (err) {
                        return res.json(err);
                    } else {
                        if (!result) {
                            req.flash('reason_fail', 'Wrong password. Please check your password.');
                            res.redirect('/auth/login');
                        } else {
                            console.log(user);
                            req.session.user = user;
                            res.redirect('/auth/profile');
                        }
                    }
                });
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

module.exports = {
    showRegister: showRegister,
    showLogin: showLogin,
    register: register,
    login: login,
    showProfile: showProfile,
    user: user,
    getUserList: getUserList,
    deleteUser: deleteUser,
    logout: logout
};