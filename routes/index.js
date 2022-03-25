const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController');
const product_controller = require('../controllers/productController');

/* GET home page. */
router.get('/', product_controller.index);

/// CATEGORY ROUTES ///
// router.get('/category/create', category_controller.category_create_get);
// router.post('/category/create', category_controller.category_create_post);

// router.get('/category/:id/update', category_controller.category_update_get);
// router.post('/category/:id/update', category_controller.category_update_post);

// router.get('/category/:id/delete', category_controller.category_delete_get);
// router.post('/category/:id/delete', category_controller.category_delete_post);

// router.get('/categories', category_controller.category_list);
// router.get('/category/:id', category_controller.category_detail);

// /// PRODUCT ROUTES ///
// router.get('/product/create', product_controller.product_create_get);
// router.post('/product/create', product_controller.product_create_post);

// router.get('/product/:id/update', product_controller.product_update_get);
// router.post('/product/:id/update', product_controller.product_update_post);

// router.get('/product/:id/delete', product_controller.product_delete_get);
// router.post('/product/:id/delete', product_controller.product_delete_post);

// router.get('/products', product_controller.product_list);
// router.get('/product/:id', product_controller.product_detail);

module.exports = router;
