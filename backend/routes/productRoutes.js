const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/categories', productController.getCategories);

module.exports = router;
