const aiService = require('./ai.service');
const promptBuilder = require('../utils/promptBuilder');
const htmlTemplate = require('../utils/htmlTemplate');
const pdfGenerator = require('../utils/pdfGenerator');
const Document = require('../models/Document');

class RecommendationService {
  async generate(data) {
    const enrichedData = { ...data, language: data.language || 'EN' };
    const prompt = promptBuilder.buildRecommendationPrompt(enrichedData);
    const letterText = await aiService.generate(prompt);
    const htmlContent = htmlTemplate.recommendationLetter(enrichedData, letterText);

    let doc;
    try {
      doc = await Document.create({ type: 'recommendation', inputData: enrichedData, letterText, htmlContent });
    } catch (err) {
      console.warn('MongoDB save skipped:', err.message);
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
      console.warn('PDF generation skipped:', err.message);
    }
    return result;
  }
}

module.exports = new RecommendationService();
