const mongoose = require('mongoose');

const subSchema = new mongoose.Schema({
  title: {
    type: {
      type: String,
      required: [true, 'Please enter event title'],
    },
  },
  amount: {
    type: Number,
    required: [true, 'Please enter an amount'],
  },
  desc: {
    type: Number,
    required: [true, 'Please enter description'],
  },
  status: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model('Subscription', subSchema);
