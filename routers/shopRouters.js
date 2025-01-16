const express = require('express')

const shopController = require('../controller/shopController');
const { authenticateShop } = require('../middleware/auth');
const router = express.Router();


router.post('/create-shop', shopController.createShop);
router.post('/login', shopController.logIn);
router.get('/get-single-shop/:id', shopController.getSingleShop);
router.get('/get-all-shops', shopController.getAllShops);
router.post('/shop/forgotpassword', shopController.forgotPassword);
router.get('/get-shop-profile', authenticateShop, shopController.getShopProfile);
router.post('/shop/logout', shopController.logOut);
router.post('/resetshoppassword/:link', shopController.resetShopPassword);

module.exports = router;