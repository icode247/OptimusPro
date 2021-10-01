const express = require('express');
require('dotenv').config();
const cors = require('cors');
const logger = require('morgan');
const AppError = require('./utils/appError');
const errorHandler = require('./utils/errorHandler');
const userRouter = require('./routes/userRoute');
const courseRouter = require('./routes/courseRoute');
const blogRouter = require('./routes/blogRoute');

const app = express();
app.use(cors());
app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Application Routers
//1. User router
app.use('/api/v1/user', userRouter);

//2. Course router
app.use('/api/v1/course', courseRouter);

//3. Blog router
app.use('/api/v1/blog', blogRouter);

// 4 payment router
///

app.all('*', (req, res, next) => {
  next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});

app.use(errorHandler);
module.exports = app;
