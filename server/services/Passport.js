const User = require('../models/User');

function isLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.flash('reason_fail', 'You need login to access this site');
        res.redirect('/auth/login');
    }
}

function isAdmin(req, res, next) {
    if (req.session.user) {
        if (req.session.user.role === 'ADMIN') {
            next();
        } else {
            req.flash('reason_fail', 'You need login with admin account to access this site');
            res.redirect('/auth/profile');
        }
    } else {
        req.flash('reason_fail', 'You need login with admin account first');
        res.redirect('/auth/login');
    }

}

function isNotLogin(req, res, next) {
    if (req.session.user) {
        res.redirect('/auth/profile');
    } else {
        next();
    }
}

module.exports = {
    isLogin: isLogin,
    isAdmin: isAdmin,
    isNotLogin: isNotLogin
};