const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

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
  const token = signToken(user);

  //varify if the email and password is correct
  if (!user || !user.checkCorrectPassword(password, user.password)) {
    return next(new AppError('Incorrect username or password', 401));
  }

  //if everything gose well, send a token back the client
  res.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});
