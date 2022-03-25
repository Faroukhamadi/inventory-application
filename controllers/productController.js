const Category = require('../models/category');
const Product = require('../models/product');
const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      category_count: (callback) => {
        Category.find({}, callback).count();
      },
      product_count: (callback) => {
        Product.find({}, callback).count();
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Farouk Shop Home',
        err: err,
        data: results,
      });
    }
  );
};
