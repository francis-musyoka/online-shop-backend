const express = require('express');
const{isAuthenticated} = require('../middleware/auth');
const cartController = require('../controller/customerController/cartController')

const router = express.Router();


router.post('/addproducttocart/:productId', isAuthenticated, cartController.addProductToCart );
router.get('/cart', isAuthenticated, cartController.getCustomerCart);
router.patch('/update/cart/:productId', isAuthenticated, cartController.updateCartQuantity);
router.post('/delete/cart/:productId', isAuthenticated, cartController.removeProductFromCart);
router.post('/clear/cart/',isAuthenticated, cartController.clearCart);



module.exports = router;