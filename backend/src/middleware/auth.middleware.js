const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('../utils/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No token provided, authorization denied', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
  }
};
