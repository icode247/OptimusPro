const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const paymentModel = require('../models/paymentModel');
const courseModel = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

async function varifyToken(token) {
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return decoded;
}

async function isAdmin(userId) {
  const user = await userModel.findById(userId);
  return user.isAdmin;
}

async function getUserInToken(token) {
  const decoded = await varifyToken(token);

  //get the user id from the decoded token
  const { id } = decoded;
  //verify the users details from the database
  return userModel.findById(id);
}

exports.userProtected = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.headers.authorization.split(' ')[1];

    const user = await getUserInToken(token);
    if (user) {
      return next();
    }
    return next(new AppError('You are not logged in ', 401));
  }
  return next(new AppError('You are not logged in ', 401));
});

//protect database model modification from other users
exports.adminProtected = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.headers.authorization.split(' ')[1];
    const user = await getUserInToken(token);
    if (user) {
      if ((await isAdmin(user._id)) === 'true') {
        return next();
      }
      return next(new AppError('Sorry, you dont have access', 401));
    }
    return next(new AppError('You are not logged in ', 401));
  }
  return next(new AppError('You are not logged in ', 401));
});

//protect access to paid courses
exports.paymentProtected = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    const token = req.headers.authorization.split(' ')[1];
    const user = await getUserInToken(token);
    const course = await courseModel.findById({ _id: req.params.id });
    if (user.isAdmin === true) {
      return next();
    }
    if (course.isPaid === true) {
      const paid = await paymentModel.findOne({
        user: user.email,
        course: req.params.id,
      });
      if (paid) {
        return next();
      }
      return next(new AppError('Sorry, this is paid course ', 401));
    }
    return next();
  }
  return next(new AppError('You are not logged in ', 401));
});
