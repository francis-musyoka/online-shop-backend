const express = require('express');

const router = express.Router();

const categoryContoller = require('../controller/shopController/categoryController')

router.post('/add-category', categoryContoller.addCategory);
router.get('/get-all-category', categoryContoller.getAllCategories);


module.exports = router;