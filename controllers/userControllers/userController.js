const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

//Get all the users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  console.log(id);
  //select all users or user whose id is in the query
  const users = id
    ? await User.findById(id)
    : await User.find().limit(10).sort({ _id: '-1' });
  res.status(200).json({
    status: 'success',
    length: users ? users.length : 0,
    data: {
      users,
    },
  });
});

//Get a single user by id
exports.getUser = catchAsync(async (req, res, next) => {
  //get id from  request parameters
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a user', 404));
  }
  const user = await User.findById(id);
  res.status(200).json({
    status: 'success',
    length: user.length,
    data: {
      user,
    },
  });
});

//update a single user by id
exports.updateUser = catchAsync(async (req, res, next) => {
  //get id from  request parameter
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a user', 404));
  }
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//delete a single user by id
exports.deleteUser = catchAsync(async (req, res, next) => {
  //get id from params parameters
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a user', 404));
  }
  await User.findOneAndDelete({ id });
  res.status(200).json({
    status: 'success',
    data: {
      user: null,
    },
  });
});
