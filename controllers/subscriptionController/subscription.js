const subscriptionModel = require('../../models/subscriptionModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

module.exports.getAllSubscribers = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const subscribers = id
    ? await subscriptionModel.findById(id)
    : await subscriptionModel.find().sort({ _id: '-1' }).limit(10);
  res.status(200).json({
    status: 'success',
    length: subscribers && subscribers.length,
    data: {
      subscribers,
    },
  });
});

exports.createSubscriber = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('No data in your form', 404));
  }
  const subscriber = await subscriptionModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      subscriber,
    },
  });
});
exports.getSubscriber = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  const subscriber = await subscriptionModel.findById(id);
  res.status(200).json({
    status: 'success',
    length: subscriber ? subscriber.length : 0,
    data: {
      subscriber,
    },
  });
});
exports.updateSubscriber = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  const subscriber = await subscriptionModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      subscriber,
    },
  });
});

exports.deleteSubscriber = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  await subscriptionModel.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    data: {
      subscribers: null,
    },
  });
});
