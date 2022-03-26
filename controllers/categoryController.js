const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      categories: (callback) => {
        Category.find({}, callback);
      },
      products: (callback) => {
        Product.find({ category: req.params.id }, callback);
      },
      categoryDetail: (callback) => {
        Category.findById(req.params.id, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.categoryDetail === null) {
        let err = new Error('Category detail not found');
        err.status = 404;
        return next(err);
      }
      res.render('category_detail', {
        title: 'Category detail',
        data: results,
        err: err,
      });
    }
  );
};

exports.category_create_get = (req, res, next) => {
  async.parallel(
    {
      categories: (callback) => {
        Category.find({}, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.categories === null) {
        let err = new Error('Category list not found');
        err.status = 404;
        return next(err);
      }
      res.render('category_form', {
        title: 'Create Category',
        data: results,
      });
    }
  );
};

exports.category_create_post = [
  // Validate and sanitize fields
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Description must be specified.'),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from the request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Create Category',
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid

      // Create category Object with escaped and trimmed data
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });

      category.save((err) => {
        if (err) return next(err);

        // Successful - redirect to new category record
        res.redirect(category.url);
      });
    }
  },
];

exports.category_update_get = (req, res, next) => {
  async.parallel(
    {
      categories: (callback) => {
        Category.find({}, callback);
      },
      category: (callback) => {
        Category.findById(req.params.id, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.category === null) {
        let err = new Error('Category not found');
        err.status = 404;
        return next(err);
      }
      // Success
      res.render('category_form', {
        title: 'Update Category',
        data: results,
      });
    }
  );
};

exports.category_update_post = [
  // Validate and sanitize fields
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric()
    .withMessage('Name has non-alphanumeric characters.'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage('Description must be specified.'),
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with escaped/trimmed data and old id
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages
      res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        (err, thecategory) => {
          if (err) return next(err);
          // Successful - redirect to category detail page
          res.redirect(thecategory.url);
        }
      );
    }
  },
];
// 623e8609aa48b7b5103ba2ce
