const express = require('express');
const{isAuthenticated} = require('../middleware/auth');
const mpesaTransactionController = require('../controller/customerController/mpesaTransactionController')

const router = express.Router();


router.post('/stkpush',isAuthenticated, mpesaTransactionController.stkPush );
router.post('/mpesa/callback', mpesaTransactionController.mpesaCallBack );
router.get('/mpesa/transaction/status/:transactionId', mpesaTransactionController.getMpesaTransactionStatus );

module.exports = router;