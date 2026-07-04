const { redisClient, isRedisEnabled } = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  async get(key) {
    if (!isRedisEnabled()) return null;
    try {
      const val = await redisClient.get(key);
      return val ? JSON.parse(val) : null;
    } catch (err) {
      logger.warn('Redis cache get failed', { key, message: err.message });
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    if (!isRedisEnabled()) return false;
    try {
      const val = JSON.stringify(value);
      await redisClient.set(key, val, 'EX', ttlSeconds);
      return true;
    } catch (err) {
      logger.warn('Redis cache set failed', { key, message: err.message });
      return false;
    }
  }

  async del(key) {
    if (!isRedisEnabled()) return false;
    try {
      await redisClient.del(key);
      return true;
    } catch (err) {
      logger.warn('Redis cache del failed', { key, message: err.message });
      return false;
    }
  }
}

module.exports = new CacheService();
