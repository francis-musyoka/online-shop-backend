const express = require('express');

const router = express.Router();
const {createUser,getAllUsers,getSingleUser,signin,logOUt,getUserProfile} = require('../controller/customer');
const{isAuthenticated} = require('../middleware/auth');

router.post('/create-user',createUser);
router.post('/signin',signin);
router.get('/getprofile', isAuthenticated,getUserProfile);
router.get('/logout',logOUt);
router.get('/getuser/:id',getSingleUser);
router.get('/get-all-users',getAllUsers);

module.exports = router