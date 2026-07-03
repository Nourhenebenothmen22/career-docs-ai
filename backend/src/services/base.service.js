const aiService = require('./ai.service');
const pdfGenerator = require('../utils/pdfGenerator');
const Document = require('../models/Document');
const logger = require('../utils/logger');

class BaseLetterService {
  constructor(type, buildPrompt, buildHtml) {
    this.type = type;
    this.buildPrompt = buildPrompt;
    this.buildHtml = buildHtml;
  }

  async generate(data) {
    const enrichedData = { ...data, language: data.language || 'EN' };
    const prompt = this.buildPrompt(enrichedData);
    const letterText = await aiService.generate(prompt);
    const htmlContent = this.buildHtml(enrichedData, letterText);

    let doc;
    try {
      doc = await Document.create({
        type: this.type,
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

  async generateWithPdf(data) {
    const result = await this.generate(data);
    try {
      result.pdfBuffer = await pdfGenerator.generate(result.htmlContent);
    } catch (err) {
      logger.warn('PDF generation skipped', { message: err.message });
    }
    return result;
  }
}

module.exports = BaseLetterService;
