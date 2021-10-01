const express = require('express');
const courseController = require('../controllers/courseControllers/courseController');
const videoController = require('../controllers/courseControllers/videoController');
const upload = require('../utils/uploader');
const middleware = require('../middlewares/middleware');

const router = express.Router();

router
  .route('/')
  .get(middleware.adminProtected, courseController.getAllCourse)
  .post(middleware.adminProtected, courseController.createCourse);

router
  .route('/:id')
  .get(
    middleware.userProtected,
    middleware.paymentProtected,
    courseController.getCourse
  )
  .patch(middleware.adminProtected, courseController.updateCourse)
  .delete(middleware.adminProtected, courseController.deleteCourse);

router
  .route('/:id/video')
  .get(
    middleware.userProtected,
    middleware.paymentProtected,
    videoController.getAllVideos
  )
  .post(
    middleware.adminProtected,
    upload.single('video'),
    videoController.createVideo
  );

router
  .route('/:id/video/:videoId')
  .get(
    middleware.userProtected,
    middleware.paymentProtected,
    videoController.streamVideo
  )
  .patch(middleware.adminProtected, videoController.updateVideo)
  .delete(middleware.adminProtected, videoController.deleteVideo);

module.exports = router;
