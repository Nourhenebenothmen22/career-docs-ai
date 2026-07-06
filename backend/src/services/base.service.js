const aiService = require('./ai.service');
const pdfGenerator = require('../utils/pdfGenerator');
const Document = require('../models/Document');
const storageService = require('./storage.service');
const cacheService = require('./cache.service');
const logger = require('../utils/logger');

class BaseLetterService {
  constructor(type, buildPrompt, buildHtml) {
    this.type = type;
    this.buildPrompt = buildPrompt;
    this.buildHtml = buildHtml;
  }

  async generate(data, userId = null) {
    const enrichedData = { ...data, language: data.language || 'EN' };
    const prompt = this.buildPrompt(enrichedData);
    const letterText = await aiService.generate(prompt);
    const htmlContent = this.buildHtml(enrichedData, letterText);

    let doc;
    try {
      doc = await Document.create({
        type: this.type,
        userId,
        inputData: enrichedData,
        letterText,
        htmlContent,
      });
    } catch (err) {
      logger.warn('MongoDB save skipped', { message: err.message });
    }

    return {
      id: doc?._id,
      letterText,
      htmlContent,
      createdAt: doc?.createdAt || new Date(),
    };
  }

  async generateWithPdf(data, userId = null) {
    let result = null;
    const docId = data.id;

    if (docId) {
      try {
        const doc = await Document.findById(docId);
        if (doc) {
          result = {
            id: doc._id,
            letterText: doc.letterText,
            htmlContent: doc.htmlContent,
            createdAt: doc.createdAt,
          };
        }
      } catch (err) {
        logger.warn('Failed to fetch existing document for PDF', { docId, message: err.message });
      }
    }

    if (!result) {
      result = await this.generate(data, userId);
    }

    try {
      if (result.id) {
        const key = `documents/${result.id}.pdf`;

        // 1. Try S3 Streaming first
        const s3StreamResult = await storageService.downloadStream(key);
        if (s3StreamResult) {
          result.pdfStream = s3StreamResult.stream;
          result.contentLength = s3StreamResult.contentLength;
          return result;
        }

        // 2. Try Redis/Memory Cache fallback
        const cachedPdfBase64 = await cacheService.get(`pdf:doc:${result.id}`);
        if (cachedPdfBase64) {
          const pdfBuffer = Buffer.from(cachedPdfBase64, 'base64');
          result.pdfBuffer = pdfBuffer;
          result.contentLength = pdfBuffer.length;
          return result;
        }
      }

      // 3. Fallback to generating on the fly
      const pdfBuffer = await pdfGenerator.generate(result.htmlContent);
      result.pdfBuffer = pdfBuffer;
      result.contentLength = pdfBuffer.length;

      if (result.id) {
        const key = `documents/${result.id}.pdf`;
        
        // Upload to S3 in background
        storageService.upload(key, pdfBuffer, 'application/pdf')
          .then(() => {
            Document.findByIdAndUpdate(result.id, { pdfUrl: `/api/history/${result.id}/pdf` }).catch(() => {});
          })
          .catch(err => logger.warn('Failed to upload PDF to S3 in background', { message: err.message }));

        // Cache locally/Redis for subsequent requests (24 hours)
        await cacheService.set(`pdf:doc:${result.id}`, pdfBuffer.toString('base64'), 86400);
      }
    } catch (err) {
      logger.warn('PDF generation failed or skipped S3/Cache steps', { message: err.message });
    }
    return result;
  }
}

module.exports = BaseLetterService;
