const fs = require('fs');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const courseModel = require('../../models/courseModel');
const videoModel = require('../../models/videoModel');

exports.getAllVideos = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const videos = await courseModel.findOne({ _id: id }).populate('videos');
  res.status(200).json({
    status: 'success',
    data: {
      videos,
    },
  });
});

exports.createVideo = catchAsync(async (req, res, next) => {
  if (!req.body || !req.file) {
    return next(new AppError('No data in your form', 404));
  }
  const { name, courseId, courseIndex, isIntro } = req.body;
  const courseObj = await courseModel.findOne({ _id: courseId });

  const video = await videoModel.create({
    name,
    courseId,
    courseIndex,
    isIntro,
    video: req.file.filename,
  });
  courseObj.videos.push(video);
  courseObj.save();
  res.status(201).json({
    status: 'success',
    data: {
      video,
    },
  });
});

exports.streamVideo = catchAsync(async (req, res) => {
  //get the range value from the request headers
  const { range } = req.headers;
  //get the ID of the vidoe from the request paramter
  const { videoId } = req.params;
  //find the video in the video model
  const data = await videoModel.findById(videoId);
  //destructure the data object from the vidoe to get the video
  const { video } = data;
  //get the video path from the file system
  const videoPath = `public/tutVideos/${video}`;
  //get the total size of the video
  const videoSize = fs.statSync(videoPath).size;
  //get a chunk size for the video (16m)
  const CHUNK_SIZE = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const videoLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-length': videoLength,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, headers);
  const vidoeStream = fs.createReadStream(videoPath, { start, end });
  vidoeStream.pipe(res);
});

exports.updateVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const video = await videoModel.findByIdAndUpdate(id, { new: true });
  res.status(201).json({
    status: 'success',
    data: {
      video,
    },
  });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  await videoModel.findByIdAndDelete(videoId);
  res.status(200).json({
    status: 'success',
    data: {
      video: null,
    },
  });
});
