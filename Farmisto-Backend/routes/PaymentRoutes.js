const express = require('express');
const router = express.Router();
const Authentication = require("../middleware/Authentication");
const requireRole = require("../middleware/Authorization");
const { createPayment, GetPayments, UpdatePayment } = require('../controllers/PaymentController');

router.post('/create-payment',Authentication,createPayment);
router.get('/farmer-get-payment',Authentication,requireRole("farmer"),GetPayments);
router.patch('/farmer-update-payment',Authentication,requireRole("farmer"),UpdatePayment);

module.exports = router;