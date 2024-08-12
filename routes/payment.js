const express = require('express');
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const verifyJWT = require("../middleware/verifyJWT");

router.route('/')
    .post(paymentController.createPaymentIntent);

module.exports = router;