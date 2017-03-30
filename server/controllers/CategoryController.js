const path = require('path');
const Category = require('../models/Category');
const Utils = require('../helpers/Utils');
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');
const htmlspecialchars = require('htmlspecialchars');

function category(req, res, next) {
    res.render('pages/category/category-list');
}

function getCategoryList(req, res, next) {
    Category.find({is_active: true}, function (err, filteredCategories) {
        if (err) {
            return res.json({"error": err,
                "recordsTotal": 0,
                "recordsFiltered": 0,
                "data": []});
        } else {
            var categories = [];
            var start = parseInt(req.body.start);
            var length = parseInt(req.body.length);
            for (var i = 0; i < start + length && i < filteredCategories.length; i++) {
                categories.push(filteredCategories[i]);
            }
            res.json({
                "recordsTotal": filteredCategories.length,
                "recordsFiltered": filteredCategories.length,
                "data": categories
            });
        }
    });
}

function showAddCategory(req, res, next) {
    res.render('pages/category/add-category');
}

function addCategory(req, res, next) {
    var newCategory = new Category(req.body);
    newCategory.id = Utils.getUUID();
    newCategory.name = htmlspecialchars(req.body.name);
    newCategory.save(function (error) {
        if (error) {
            return Utils.getStringErrors(error.errors, function (err, message) {
                if (err) {
                    return res.json(err);
                } else {
                    var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                    req.flash('reason_fail', errMessage.message);
                    res.redirect('/category/add-category');
                }
            });
        } else {
            req.flash('success', 'New category has been added');
            res.redirect('/category/category-list');
        }
    });
}

function deleteCategory(req, res, next) {
    if (req.session.user.role === 'ADMIN') {
        for (var i = 0; i < req.body.countCategory; i++) {
            Category.findOne({id: req.body.listCategoryId.split(';')[i]}).exec(function (err, category) {
                if (err) {
                    return next(err);
                } else {
                    category.is_active = false;
                    category.save(function (err, updatedCategory) {
                        if (err) {
                            return res.json(err);
                        }
                    });
                }
            });
        }
        res.redirect('/category/category-list');
    } else {
        req.flash('reason_fail', 'You need login with admin account to delete category');
        res.redirect('/category/category-list');
    }

}

function viewCategory(req, res, next) {
    Category.findOne({id: req.query.categoryId}, function (err, category) {
        if (err) {
            return res.json(err);
        } else {
            res.render('pages/category/category-detail', {id: category.id, name: Utils.htmlspecialchars_decode(category.name)});
        }
    });
}

function editCategory(req, res, next) {
    Category.findOne({id: req.body.categoryId}, function (err, category) {
        if (err) {
            return res.json(err);
        } else {
            category.name = htmlspecialchars(req.body.name);
            category.updated_at = new Date();
            category.save(function (error) {
                if (error) {
                    return Utils.getStringErrors(error.errors, function (err, message) {
                        if (err) {
                            return res.json(err);
                        } else {
                            var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                            req.flash('reason_fail', errMessage.message);
                            res.writeHead(303, {Location: req.headers.referer});
                            res.end();
                        }
                    });
                } else {
                    req.flash('success', 'Category has been edited');
                    res.redirect('/category/category-list');
                }
            });
        }
    });
}

module.exports = {
    category: category,
    getCategoryList: getCategoryList,
    showAddCategory: showAddCategory,
    addCategory: addCategory,
    deleteCategory: deleteCategory,
    viewCategory: viewCategory,
    editCategory: editCategory
};