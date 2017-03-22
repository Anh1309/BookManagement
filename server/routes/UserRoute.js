const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const passport = require('../services/Passport');

router.route('/user-list').get(passport.isAdmin, userController.user);
router.route('/user-list').post(userController.getUserList);

router.route('/delete-user').post(userController.deleteUser);

module.exports = router;