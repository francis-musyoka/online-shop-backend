const express = require('express');

const router = express.Router();
const {
    createUser,
    getAllUsers,
    getSingleUser,
    signin,
    logOUt,
    getUserProfile,
    updateUseProfile,
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controller/customer');

const{isAuthenticated} = require('../middleware/auth');

router.post('/signup',createUser);
router.post('/signin',signin);
router.get('/get-user-profile', isAuthenticated,getUserProfile);
router.patch('/update-user-profile/:id', isAuthenticated,updateUseProfile);
router.patch('/update-user-password/:id', isAuthenticated,updatePassword);
router.get('/logout',logOUt);
router.get('/getsingleuser/:id',getSingleUser);
router.get('/get-all-users',getAllUsers);
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:link', resetPassword)

module.exports = router