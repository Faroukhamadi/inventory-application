const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

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
