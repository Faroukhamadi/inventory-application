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
        title: 'Farouk Shop Home',
        err: err,
        data: results,
      });
    }
  );
};
