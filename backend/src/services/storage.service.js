const { PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, bucketName, isStorageEnabled } = require('../config/storage');
const logger = require('../utils/logger');

class StorageService {
  async upload(key, buffer, contentType = 'application/octet-stream') {
    if (!isStorageEnabled()) return null;
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });
      await s3Client.send(command);
      logger.info('S3 file upload successful', { key });
      return key;
    } catch (err) {
      logger.error('S3 file upload failed', { key, message: err.message });
      return null;
    }
  }

  async download(key) {
    if (!isStorageEnabled()) return null;
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const response = await s3Client.send(command);
      
      return new Promise((resolve, reject) => {
        const chunks = [];
        response.Body.on('data', (chunk) => chunks.push(chunk));
        response.Body.on('end', () => resolve(Buffer.concat(chunks)));
        response.Body.on('error', (err) => reject(err));
      });
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        logger.debug('S3 file not found', { key });
      } else {
        logger.error('S3 file download failed', { key, message: err.message });
      }
      return null;
    }
  }

  async exists(key) {
    if (!isStorageEnabled()) return false;
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(command);
      return true;
    } catch (err) {
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        return false;
      }
      logger.warn('S3 object exists check failed', { key, message: err.message });
      return false;
    }
  }

  async delete(key) {
    if (!isStorageEnabled()) return false;
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(command);
      logger.info('S3 file deletion successful', { key });
      return true;
    } catch (err) {
      logger.error('S3 file deletion failed', { key, message: err.message });
      return false;
    }
  }
}

module.exports = new StorageService();
