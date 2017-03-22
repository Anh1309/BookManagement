const path = require('path');
const Book = require('../models/Book');
const Utils = require('../helpers/Utils');
const Category = require('../models/Category');
const User = require('../models/User');
const async = require('async');

function book(req, res, next) {
    res.render('pages/book/book-list');
}

function getBookList(req, res, next) {
    Book.find({}).sort({created_at: -1}).exec(function (err, filteredBooks) {
        if (err) {
            return res.json({
                "error": err,
                "recordsTotal": 0,
                "recordsFiltered": 0,
                "data": []
            });
        } else {
            var books = [];
            async.forEachSeries(filteredBooks, function(filteredBook, callback){
                if (err) {
                    callback(err);
                } else {
                    Category.findOne({id: filteredBook.category_id}, function(err, category){
                        if (category) {
                            User.findOne({id: filteredBook.author}, function(err, user){
                                if (user) {
                                    books.push({book: filteredBook, category: category, user: user});
                                    callback();
                                } else {
                                    callback();
                                }
                            });
                        } else {
                            callback();
                        }
                    });
                }
            }, function(err){
                if (err) {
                    return res.json(err);
                } else {
                    console.log(books);
                    res.json({
                        "recordsTotal": filteredBooks.length,
                        "recordsFiltered": filteredBooks.length,
                        "data": books
                    });
                }
            });
            
        }
    });
}

function showAddBook(req, res, next) {
    Category.find({is_active: true}, function (err, categories) {
        if (err) {
            return res.json(err);
        } else {

            res.render('pages/book/add-book', {categories: categories});
        }
    });
}

function addBook(req, res, next) {
    var newBook = new Book(req.body);
    newBook.id = Utils.getUUID();
    newBook.author = req.session.user.id;
    newBook.save(function (err, result) {
        if (err) {
            return res.json(err);
        } else {
            
            req.flash('success', 'New book has been added');
            res.redirect('/book/book-list');
        }
    });

}

function deleteBook(req, res, next) {
    for(var i = 0; i < req.body.countBook; i++) {
        Book.remove({id: req.body.listBookId.split(';')[i]}).exec(function(err) {
            if (err) {
                return next(err);
            }
        });
    }
    res.redirect('/book/book-list');
}

module.exports = {
    book: book,
    getBookList: getBookList,
    showAddBook: showAddBook,
    addBook: addBook,
    deleteBook: deleteBook
};