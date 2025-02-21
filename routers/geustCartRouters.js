const express = require('express');
const guestCartController = require('../controller/guestCartController')

const router = express.Router();


router.post('/addproducttoguestcart', guestCartController.addProductToGuestCart );
router.get('/guestcart/:guestId', guestCartController.getGuestCart);
router.patch('/update/guestcart/:productId', guestCartController.updateGuestCartQuantity);
router.post('/delete/guestcart/:productId', guestCartController.removeProductFromGuestCart);




module.exports = router;