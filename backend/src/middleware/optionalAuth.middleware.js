const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { id: decoded.id, email: decoded.email };
  } catch (err) {
    // Gracefully ignore validation errors for optional auth
  }
  next();
};
