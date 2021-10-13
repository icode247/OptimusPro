/* eslint-disable func-names */
const bcrypt = require('bcrypt');
const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require('constants');
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'We need your email address'],
    unique: [true, 'An account exits with this email'],
    lowercase: true,
    validate: [validator.isEmail, 'please enter valid email'],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please choose a password'],
    select: false,
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  paidCourse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  subscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcription',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if the password is modified
  if (!this.isModified('password')) return next();

  //Hash user password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.checkCorrectPassword = function (userPassword, dbPassword) {
  return bcrypt.compare(userPassword, dbPassword);
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('Accounts', userSchema);
module.exports = User;
