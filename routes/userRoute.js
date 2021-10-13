const express = require('express');
const authController = require('../controllers/userControllers/authController');
const userController = require('../controllers/userControllers/userController');

const router = express.Router();
//user authentication routes
router.route('/signup').post(authController.Signup);
router.route('/signin').post(authController.Signin);

router.route('/forgotPassword').post(authController.ForgotPassword);
router.route('/updatePassword').post(authController.UpdatePassword);
router.route('/resetPassword/:resetToken').patch(authController.VerifyPassword);

//user resource routes
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/stats').post(authController.Signin);
module.exports = router;
