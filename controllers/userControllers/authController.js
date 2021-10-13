const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const sendMail = require('../../utils/mail');

//token generator function
const signToken = (id) => {
  const token = jwt.sign(
    { id: id._id, isAdmin: id.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  return token;
};

//user signup controller
exports.Signup = catchAsync(async (req, res, next) => {
  if (req.body) {
    const newUser = await User.create(req.body);
    const token = signToken(newUser);
    res.status(200).json({
      status: 'success',
      data: {
        user: newUser,
        token,
      },
    });
  } else {
    next(new AppError('You can submit empty fields', 401));
  }
});

//user signin controller
exports.Signin = catchAsync(async (req, res, next) => {
  //Get the email and password from the client
  const { email, password } = req.body;

  //varify email and password are filled
  if (!email || !password) {
    return next(new AppError('Please provide email and password'));
  }

  //Find the user with the email from the database
  const user = await User.findOne({ email }).select('+password');

  //varify if the email and password is correct
  if (!user || !(await user.checkCorrectPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }
  const token = signToken(user);
  //if everything gose well, send a token back the client
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

//forgot password handler functions.

exports.ForgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`;
  const message = `Someone asked for a password reset on www.optimusPro.com.
  - Email: ${user.email}
  
  If you want to reset your password, please follow this link: ${resetURL} `;

  try {
    sendMail({
      subject: 'Password reset at www.optimusPro.com',
      to: user.email,
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    return next(new AppError('There was an error sending the mail'), 500);
  }
});

exports.VerifyPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('The reset token is invalid or has expired'), 401);
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  const message = `Hi ${user.email} \n 
  This is a confirmation that the password for your account ${user.email} has just been changed.\n`;
  try {
    sendMail({
      subject: 'Your password has been changed',
      to: user.email,
      message,
    });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    return next(new AppError('There was an error sending the mail'), 500);
  }
});

exports.UpdatePassword = catchAsync(async (req, res, next) => {
  if (!req.body.newPassword || !req.body.oldPassword || !req.body.email) {
    return next(
      new AppError(
        'email, oldPassword, and newPassword fields are required',
        404
      )
    );
  }
  const user = await User.findOne({ email: req.body.email }).select(
    '+password'
  );
  if (!user) return next(new AppError('No user with that email address', 404));
  if (!(await user.checkCorrectPassword(req.body.oldPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  user.password = req.body.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();
  res.status(200).json({
    status: 'success',
  });
});
