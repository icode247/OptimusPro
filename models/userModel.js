/* eslint-disable func-names */
const bcrypt = require('bcrypt');
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
  isAdmin: {
    type: String,
    default: false,
  },
  paidCourse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
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
const User = mongoose.model('Accounts', userSchema);
module.exports = User;
