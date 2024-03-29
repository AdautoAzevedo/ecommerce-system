const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const verifyJWT = require('../middleware/verifyJWT');
const isAdmin = require('../middleware/isAdmin');

router.route('/')
    .get(productsController.getAllProducts)
    .post(verifyJWT, isAdmin, productsController.storeNewProduct);

router.route('/product/:index')
    .get(productsController.getProductById)
    .put(verifyJWT, productsController.editProduct)
    .delete(verifyJWT, productsController.deleteProduct);

router.route('/:category_id')
    .get(productsController.getProductsByCategory);

module.exports = router;