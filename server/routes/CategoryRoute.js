const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const passport = require('../services/Passport');

router.route('/category-list').get(passport.isLogin, categoryController.category);

router.route('/category-list').post(categoryController.getCategoryList);

router.route('/add-category').get(passport.isLogin, categoryController.showAddCategory);

router.route('/add-category').post(categoryController.addCategory);

router.route('/delete-category').post(categoryController.deleteCategory);

module.exports = router;