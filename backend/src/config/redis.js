const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
let redisEnabled = false;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ
    retryStrategy(times) {
      if (times > 3) {
        redisEnabled = false;
        return null;
      }
      return Math.min(times * 100, 2000);
    }
  });

  redisClient.on('connect', () => {
    redisEnabled = true;
    logger.info('Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    redisEnabled = false;
    logger.warn('Redis error — cache and queue services running in fallback/degraded mode', { message: err.message });
  });
} catch (err) {
  logger.warn('Failed to initialize Redis — cache and queue services running in fallback/degraded mode', { message: err.message });
}

module.exports = {
  redisClient,
  isRedisEnabled: () => redisEnabled && redisClient?.status === 'ready',
};
