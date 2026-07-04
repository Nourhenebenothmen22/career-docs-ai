const aiService = require('./ai.service');
const pdfGenerator = require('../utils/pdfGenerator');
const Document = require('../models/Document');
const storageService = require('./storage.service');
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
    const result = await this.generate(data, userId);
    try {
      if (result.id) {
        const key = `documents/${result.id}.pdf`;
        const exists = await storageService.exists(key);
        if (exists) {
          result.pdfBuffer = await storageService.download(key);
          return result;
        }
      }

      const pdfBuffer = await pdfGenerator.generate(result.htmlContent);
      result.pdfBuffer = pdfBuffer;

      if (result.id) {
        const key = `documents/${result.id}.pdf`;
        storageService.upload(key, pdfBuffer, 'application/pdf')
          .then(() => {
            Document.findByIdAndUpdate(result.id, { pdfUrl: `/api/history/${result.id}/pdf` }).catch(() => {});
          })
          .catch(err => logger.warn('Failed to upload PDF to S3 in background', { message: err.message }));
      }
    } catch (err) {
      logger.warn('PDF generation skipped', { message: err.message });
    }
    return result;
  }
}

module.exports = BaseLetterService;
