const { validationResult } = require('express-validator');
const { AppError } = require('../utils/AppError');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const errorHandler = (err, req, res, _next) => {
  if (err.isOperational) {
    logger.warn(`${err.code}: ${err.message}`, { statusCode: err.statusCode, path: req.originalUrl });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      ...(err.errors && { errors: err.errors }),
    });
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack, path: req.originalUrl });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { detail: err.message }),
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { validate, errorHandler, notFoundHandler };
