const express = require('express');
const{isAuthenticated} = require('../middleware/auth');
const mpesaNumberController = require('../controller/customerController/mpesaNumberController')

const router = express.Router();


router.post('/savempesapayment', isAuthenticated, mpesaNumberController.saveMpesaNumber );
router.get('/mpesapayment', isAuthenticated, mpesaNumberController.getMpesaNumber);
router.patch('/update/mpesapayment/:id', isAuthenticated, mpesaNumberController.updateMpesaNumber);
router.post('/delete/mpesapayment/:id', isAuthenticated, mpesaNumberController.deleteMpesaNumber);



module.exports = router;