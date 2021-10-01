const mongoose = require('mongoose');
// const generator = require('../utils/generator');

const paymentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'please provide user email'],
  },
  amount: {
    type: Number,
    required: [true, 'Please give course name'],
    unique: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Payment', paymentSchema);
