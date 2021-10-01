const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Course = require('../../models/courseModel');

exports.getAllCourse = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const courses = id
    ? await Course.findById(id)
    : await Course.find().sort({ _id: '-1' }).limit(10);
  res.status(201).json({
    status: 'success',
    length: courses && courses.length,
    data: {
      courses,
    },
  });
});
exports.createCourse = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('No data in your form', 404));
  }
  const course = await Course.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
});
exports.getCourse = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  const course = await Course.findById(id);
  res.status(200).json({
    status: 'success',
    length: course ? course.length : 0,
    data: {
      course,
    },
  });
});
exports.updateCourse = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    status: 'success',
    data: {
      course,
    },
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  //varify if request has params
  if (!req.params) {
    return next(new AppError('No params specified', 404));
  }
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.status(200).json({
    status: 'success',
    data: {
      course: null,
    },
  });
});
