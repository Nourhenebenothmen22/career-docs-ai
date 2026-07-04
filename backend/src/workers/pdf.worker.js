const { Worker } = require('bullmq');
const { redisClient } = require('../config/redis');
const pdfGenerator = require('../utils/pdfGenerator');
const storageService = require('../services/storage.service');
const Document = require('../models/Document');
const logger = require('../utils/logger');

function startWorker() {
  if (!redisClient) {
    logger.warn('Redis not initialized — PDF background worker is disabled');
    return null;
  }

  const worker = new Worker('pdf-generation', async (job) => {
    const { documentId, htmlContent } = job.data;
    logger.info(`Starting PDF generation job for document: ${documentId}`);

    const pdfBuffer = await pdfGenerator.generate(htmlContent);
    const key = `documents/${documentId}.pdf`;

    // Upload to S3/MinIO
    await storageService.upload(key, pdfBuffer, 'application/pdf');

    try {
      await Document.findByIdAndUpdate(documentId, { pdfUrl: `/api/history/${documentId}/pdf` });
    } catch (err) {
      logger.warn('Failed to update Document pdfUrl status', { documentId, message: err.message });
    }

    return { key };
  }, {
    connection: redisClient,
    concurrency: 2, // Concurrency limit to prevent system resource exhaustion
  });

  worker.on('completed', (job) => {
    logger.info(`PDF generation job completed for document: ${job.data.documentId}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`PDF generation job failed for document: ${job?.data?.documentId}`, { message: err.message });
  });

  worker.on('error', (err) => {
    logger.warn('BullMQ PDF worker connection error', { message: err.message });
  });

  return worker;
}

module.exports = {
  startWorker,
};
