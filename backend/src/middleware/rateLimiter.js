const { HTTP } = require('../utils/constants');
const logger = require('../utils/logger');

const requests = new Map();

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || HTTP.RATE_LIMIT_WINDOW_MS;
  const max = options.max || HTTP.RATE_LIMIT_MAX;

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of requests) {
      if (now - entry.start > windowMs) requests.delete(key);
    }
  }, windowMs);

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    let entry = requests.get(key);
    if (!entry || now - entry.start > windowMs) {
      entry = { count: 0, start: now };
      requests.set(key, entry);
    }

    entry.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', entry.start + windowMs);

    if (entry.count > max) {
      logger.warn('Rate limit exceeded', { key });
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      });
    }

    next();
  };
};

module.exports = rateLimiter;
