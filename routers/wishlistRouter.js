const express = require('express');
const{isAuthenticated} = require('../middleware/auth');
const wishlistController =require('../controller/wishlistController')

const router = express.Router();

router.post('/add/remove/:productId', isAuthenticated, wishlistController.addAndRemoveFromWishlist );
router.get('/check/product/:productId', isAuthenticated, wishlistController.checkIfProductIsInWishlist );
router.get('/wishlist/product', isAuthenticated, wishlistController.getWishlist );
router.get('/wishlist-limitted/product', isAuthenticated, wishlistController.getLimittedWishlist );


module.exports = router;