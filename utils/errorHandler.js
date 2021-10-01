/* eslint-disable no-param-reassign */
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
