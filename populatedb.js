#! /usr/bin/env node

console.log(
  'This script populates some test categories, categories, products and products to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Category = require('./models/category');
const Product = require('./models/product');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const products = [];

function categoryCreate(name, description, cb) {
  categoryDetail = { name: name, description: description };
  const category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function productCreate(name, description, category, cb) {
  const product = new Product({
    name: name,
    description: description,
    category: category,
  });

  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New product: ' + product);
    products.push(product);
    cb(null, product);
  });
}

function createProductsCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Computers',
          "A category in which you find cool computers and stuff you'll definitely enjoy",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Gaming Consoles',
          "A category in which you find cool consoles and stuff you'll definitely enjoy",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Headphones',
          "A category in which you find cool headphones and stuff you'll definitely enjoy",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Smartphones',
          "A category in which you find cool smartphones and stuff you'll definitely enjoy",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Cameras',
          "A category in which you find cool cameras and stuff you'll definitely enjoy",
          callback
        );
      },
      function (callback) {
        productCreate(
          'iPhone 12 Pro',
          'Includes a brand new, generic charging cable that is certified Mfi (Made for iPhone) and a brand new, generic wall plug',
          categories[0],
          callback
        );
      },
      function (callback) {
        productCreate(
          'iPhone 13 Pro',
          'Includes a brand new, generic charging the wall with very efficient technologies specified for the job',
          categories[1],
          callback
        );
      },
      function (callback) {
        productCreate(
          'iPhone X ',
          'Includes amazing features with fast charging capabilities that are amazingly crafted by our apple hard-working employees',
          categories[2],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createProductsCategories],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('BOOKInstances: ' + products);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
