const AppError = require('../../utils/appError');
const blogModel = require('../../models/blogModel');
const catchAsync = require('../../utils/catchAsync');

//Get all the blogs
exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await blogModel.find({});
  res.status(200).json({
    status: 'success',
    length: blogs.length,
    data: {
      blogs,
    },
  });
});
//Get a single blog by id
exports.createBlog = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('No data in your form', 404));
  }
  const course = await blogModel.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
});
//Get a single blog by id
exports.getBlog = catchAsync(async (req, res, next) => {
  //get id from  request parameters
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a blog', 404));
  }
  const blog = await blogModel.findById(id);
  res.status(200).json({
    status: 'success',
    length: blog.length,
    data: {
      blog,
    },
  });
});

//update a single blog by id
exports.updateBlog = catchAsync(async (req, res, next) => {
  //get id from  request parameter
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a blog', 404));
  }
  const blog = await blogModel.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

//delete a single blog by id
exports.deleteBlog = catchAsync(async (req, res, next) => {
  //get id from params parameters
  const { id } = req.params;
  if (!id) {
    next(new AppError('id parameter is required to get a blog', 404));
  }
  await blogModel.findOneAndDelete({ id });
  res.status(200).json({
    status: 'success',
    data: {
      blog: null,
    },
  });
});
