const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

exports.index = (req, res, next) => {
  async.parallel(
    {
      category_count: (callback) => {
        Category.find({}, callback).count();
      },
      product_count: (callback) => {
        Product.find({}, callback).count();
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
