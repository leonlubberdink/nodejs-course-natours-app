const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404)
      );
    }

    res.status(204).json({
      status: 'succes',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: 'succes',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const document = await query;

    if (!document) {
      return next(
        new AppError(`No document found with ID ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    let query = Model.find(filter);

    if (popOptions) query = query.populate(popOptions);

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const document = await features.query;

    res.status(200).json({
      status: 'success',
      results: document.length,
      data: {
        data: document,
      },
    });
  });
