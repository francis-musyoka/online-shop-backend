const express = require('express');
const{isAuthenticated} = require('../middleware/auth');
const shippingAddressController =require('../controller/shippingAddressController')

const router = express.Router();

router.post('/add-new-address', isAuthenticated, shippingAddressController.addNewAddress );
router.get('/addresses', isAuthenticated, shippingAddressController.getAddresses );
router.patch('/update/address/:addressId', isAuthenticated, shippingAddressController.updateAddress );
router.post('/remove/address/:addressId', isAuthenticated, shippingAddressController.removeAddress );


module.exports = router;