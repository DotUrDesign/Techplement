const express = require('express');
const userRouter = express.Router();
const { registerUser, loginUser, protectRoute, logout } = require('../Controllers/authController');
const { userProfile, updateProfile, deleteProfile } = require('../Controllers/userController'); 

userRouter
.route('/register')
.post(registerUser);

userRouter
.route('/login')
.post(loginUser);

userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(userProfile);

userRouter
.route('/updateProfile')
.post(updateProfile);

userRouter
.route('/deleteProfile')
.delete(deleteProfile);

userRouter
.route('/logout')
.post(logout);

module.exports = userRouter;