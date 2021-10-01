const multer = require('multer');
const generator = require('./generator');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/tutVideos');
  },
  filename: (req, file, cb) => {
    // eslint-disable-next-line prefer-destructuring
    const ext = file.mimetype.split('/')[1];
    cb(null, `${generator(20)}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage: multerStorage });
module.exports = upload;
