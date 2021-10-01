const mongoose = require('mongoose');

const vidoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a name'],
  },
  courseId: {
    type: String,
    required: [true, 'please provide a name'],
  },
  courseIndex: {
    type: String,
    required: [true, 'please provide a name'],
  },
  isIntro: {
    type: Boolean,
    default: false,
  },
  video: {
    type: String,
    required: [true, 'please provide a name'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Vidoes', vidoeSchema);
