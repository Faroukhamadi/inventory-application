const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = (req, res, next) => {
  async.parallel(
    {
      category_count: (callback) => {
        Category.find({}, callback).count();
      },
      product_count: (callback) => {
        // Product.find({}, callback).count();
        Product.aggregate(
          [{ $group: { _id: null, quantity: { $sum: '$quantity' } } }],
          callback
        );
      },
      categories: (callback) => {
        Category.find({}, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.categories === null) {
        let err = new Error('Categories not found');
        err.status = 404;
        return next(err);
      }
      res.render('index', {
        title: "Farouk's Shop Home",
        data: results,
        err: err,
      });
    }
  );
};

exports.product_detail = (req, res, next) => {
  async.parallel(
    {
      categories: (callback) => {
        Category.find({}, callback);
      },
      productDetail: (callback) => {
        Product.findById(req.params.id, callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.productDetail === null) {
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      res.render('product_detail', {
        title: 'Product detail',
        data: results,
        err: err,
      });
    }
  );
};

exports.product_create_get = (req, res, next) => {
  Category.find({}, 'name').exec((err, categories) => {
    if (err) return next(err);
    // Successful, so render
    res.render('product_form', {
      title: 'Add Product',
      category_list: categories,
    });
  });
};

exports.product_create_post = [
  // Validate and sanitize fields
  body('category', 'Category must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('price', 'Price must be superior to zero').trim().isNumeric(),
  body('quantity', 'Quantity must be superior to zero').trim().isNumeric(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from request
    const errors = validationResult(req);

    // Create a product object with escaped and trimmed data
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and errors
      Category.find({}, 'name').exec((err, categories) => {
        if (err) return next(err);
        res.render('product_form', {
          title: 'Add Product',
          category_list: categories,
          selected_category: product.category._id,
          errors: errors.array(),
          product: product,
        });
      });
      return;
    } else {
      // Data from form is valid
      product.save((err) => {
        if (err) return next(err);
        // Successful - redirect to new product
        res.redirect(product.url);
      });
    }
  },
];

exports.product_update_get = (req, res, next) => {
  async.parallel(
    {
      categories: (callback) => {
        Category.find(callback);
      },
      product: (callback) => {
        Product.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.product === null) {
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      }
      res.render('product_form', {
        title: 'Update Product',
        data: results,
        selected_category: results.product.category._id,
        category_list: results.categories,
      });
    }
  );
};

exports.product_update_post = [
  // Validate and sanitize fields
  body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Description must be specified.')
    .isLength({ min: 3 })
    .isLength({ max: 500 })
    .withMessage(
      'Description must have a minimum length of 3 and a maximum length of 500'
    ),
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a product object with escaped/trimmed data and old id
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages

      // Get all categories for form
      Category.find({}, 'name').exec((err, categories) => {
        if (err) return next(err);
        // Successful so render

        res.render('product_form', {
          title: 'Update Product',
          category_list: categories,
          selected_category: product.category._id,
          errors: errors.array(),
          product: product,
        });
      });
      return;
    } else {
      // Data from form is valid, update the record
      Product.findByIdAndUpdate(
        req.params.id,
        product,
        {},
        (err, theproduct) => {
          if (err) return next(err);
          // Successful - redirect to product detail page
          res.redirect(theproduct.url);
        }
      );
    }
  },
];

exports.product_delete_get = (req, res, next) => {
  Product.findById(req.params.id).exec((err, product) => {
    if (err) return next(err);
    if (product === null) {
      // no results
      res.redirect('/');
    }
    // Successful, so render
    res.render('product_delete', {
      title: 'Delete Product',
      product: product,
    });
  });
};

exports.product_delete_post = (req, res, next) => {
  Product.findById(req.params.id).exec((err, product) => {
    if (err) return next(err);
    // Success
    Product.findByIdAndRemove(req.body.productid, (err) => {
      if (err) return next(err);
      // Success - go to home page
      res.redirect('/');
    });
  });
};
