const mongoose = require('mongoose');
// const generator = require('../utils/generator');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please give course name'],
    unique: true,
  },
  instructor: {
    type: String,
    required: [true, 'please provide instructor name'],
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vidoes',
    },
  ],
  type: {
    type: String,
    required: [true, 'Please is this a crypto or forex course?'],
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    required: [true, 'Is this a  course'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Course', courseSchema);
