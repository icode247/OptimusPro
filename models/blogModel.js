const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please provide title'],
    unique: true,
  },
  body: {
    type: String,
    required: [true, 'please provide title'],
  },
  cate: {
    type: String,
    required: [true, 'please provide title'],
    unique: true,
  },
  image: {
    type: String,
    required: [true, 'please provide title'],
    unique: true,
  },
});
module.exports = mongoose.model('Blogs', blogSchema);
