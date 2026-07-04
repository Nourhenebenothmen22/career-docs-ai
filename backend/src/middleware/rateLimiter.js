const { redisClient, isRedisEnabled } = require('../config/redis');
const { HTTP } = require('../utils/constants');
const logger = require('../utils/logger');

const memoryRequests = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryRequests) {
    if (now - entry.start > HTTP.RATE_LIMIT_WINDOW_MS) {
      memoryRequests.delete(key);
    }
  }
}, HTTP.RATE_LIMIT_WINDOW_MS);

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || HTTP.RATE_LIMIT_WINDOW_MS;
  const max = options.max || HTTP.RATE_LIMIT_MAX;

  return async (req, res, next) => {
    const key = `ratelimit:${req.ip || req.connection.remoteAddress || 'unknown'}:${req.originalUrl}`;
    const now = Date.now();

    if (isRedisEnabled()) {
      try {
        const currentHits = await redisClient.incr(key);
        if (currentHits === 1) {
          await redisClient.pexpire(key, windowMs);
        }

        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - currentHits));

        if (currentHits > max) {
          logger.warn('Redis rate limit exceeded', { key });
          return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
          });
        }
        return next();
      } catch (err) {
        logger.warn('Redis rate limiter lookup failed — falling back to in-memory checks', { message: err.message });
      }
    }

    let entry = memoryRequests.get(key);
    if (!entry || now - entry.start > windowMs) {
      entry = { count: 0, start: now };
      memoryRequests.set(key, entry);
    }
    entry.count += 1;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', entry.start + windowMs);

    if (entry.count > max) {
      logger.warn('In-memory rate limit exceeded', { key });
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
