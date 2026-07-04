const { S3Client } = require('@aws-sdk/client-s3');
const logger = require('../utils/logger');

let s3Client = null;
let s3Enabled = false;

const bucketName = process.env.S3_BUCKET || 'risalatech';

if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
  try {
    const config = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      region: process.env.S3_REGION || 'us-east-1',
    };

    if (process.env.S3_ENDPOINT) {
      config.endpoint = process.env.S3_ENDPOINT;
      config.forcePathStyle = true; // Required for local MinIO path styling
    }

    s3Client = new S3Client(config);
    s3Enabled = true;
    logger.info('S3 Storage client initialized');
  } catch (err) {
    logger.warn('Failed to initialize S3 storage client — proceeding in degraded mode', { message: err.message });
  }
} else {
  logger.warn('S3 credentials not configured — S3 storage service is disabled');
}

module.exports = {
  s3Client,
  bucketName,
  isStorageEnabled: () => s3Enabled && !!s3Client,
};
