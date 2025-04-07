const express = require('express');
const{isAuthenticated} = require('../../middleware/auth');
const orderController = require('../../controller/customerController/orderController');
const { or } = require('sequelize');

const router = express.Router();

router.post("/create/order",isAuthenticated,orderController.createOrder);
router.patch("/update/order/:orderId",isAuthenticated,orderController.updateOrder);


module.exports = router;