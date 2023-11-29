const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordersController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/')
    .post(verifyJWT, orderController.processOrder);

module.exports = router;