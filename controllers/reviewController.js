const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// EXPORTS
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newReview,
    },
  });
});