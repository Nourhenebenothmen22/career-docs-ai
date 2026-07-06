const { redisClient, isRedisEnabled } = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.memoryCache = new Map();
  }

  async get(key) {
    if (isRedisEnabled()) {
      try {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        logger.warn('Redis cache get failed', { key, message: err.message });
      }
    }
    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached) {
      if (cached.expiry > Date.now()) {
        return cached.value;
      }
      this.memoryCache.delete(key);
    }
    return null;
  }

  async set(key, value, ttlSeconds = 3600) {
    if (isRedisEnabled()) {
      try {
        const val = JSON.stringify(value);
        await redisClient.set(key, val, 'EX', ttlSeconds);
        return true;
      } catch (err) {
        logger.warn('Redis cache set failed', { key, message: err.message });
      }
    }
    // Fallback to memory cache
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
    // Evict oldest item if cache gets too large (prevent memory leak)
    if (this.memoryCache.size > 200) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }
    return true;
  }

  async del(key) {
    if (isRedisEnabled()) {
      try {
        await redisClient.del(key);
        return true;
      } catch (err) {
        logger.warn('Redis cache del failed', { key, message: err.message });
      }
    }
    this.memoryCache.delete(key);
    return true;
  }
}

module.exports = new CacheService();
