const express = require('express');
const router = express.Router();
const bookController = require('../controllers/BookController');
const passport = require('../services/Passport');

router.route('/book-list').get(passport.isLogin, bookController.book);

router.route('/book-list').post(bookController.getBookList);

router.route('/add-book').get(passport.isLogin, bookController.showAddBook);

router.route('/add-book').post(bookController.addBook);

router.route('/delete-book').post(bookController.deleteBook);

module.exports = router;