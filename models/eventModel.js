const mongoose = require('mongoose');

const eventSchma = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  start: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  end: {
    type: Date,
    required: [true, 'End date is required'],
  },
});

module.exports = mongoose.models('Events', eventSchma);
