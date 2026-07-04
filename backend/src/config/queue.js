const { Queue } = require('bullmq');
const { redisClient } = require('./redis');
const logger = require('../utils/logger');

let pdfQueue = null;

if (redisClient) {
  try {
    pdfQueue = new Queue('pdf-generation', {
      connection: redisClient,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });
    pdfQueue.on('error', (err) => {
      logger.warn('BullMQ PDF Queue connection error', { message: err.message });
    });
    logger.info('BullMQ PDF Queue initialized');
  } catch (err) {
    logger.warn('Failed to initialize BullMQ PDF queue', { message: err.message });
  }
}

module.exports = {
  pdfQueue,
};
