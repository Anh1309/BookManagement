const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const passport = require('../services/Passport');

router.route('/register').get(passport.isNotLogin, userController.showRegister);
router.route('/register').post(userController.register);

router.route('/login').get(passport.isNotLogin, userController.showLogin);
router.route('/login').post(userController.login);

router.route('/profile').get(passport.isLogin, userController.showProfile);

router.route('/change-username').post(userController.changeUsername);
router.route('/change-email').post(userController.changeEmail);
router.route('/change-password').post(userController.changePassword);

router.route('/logout').get(userController.logout);

router.route('/forgot-password').get(userController.showForgotPassword);
router.route('/forgot-password').post(userController.forgotPassword);

router.route('/:token').get(userController.showResetPassword);
router.route('/reset-password').post(userController.resetPassword);

module.exports = router;