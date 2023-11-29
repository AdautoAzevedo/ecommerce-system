const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .post(verifyJWT, cartController.addItem)
    .get(verifyJWT, cartController.viewCart);

router.route('/:cartItemId')
    .put(verifyJWT, cartController.updateCartItems)
    .delete(verifyJWT, cartController.removeFromCart)

module.exports = router;