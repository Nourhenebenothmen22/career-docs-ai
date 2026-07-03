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
    const pdfBuffer = await pdfGenerator.generate(htmlContent);

    const doc = await Document.create({
      type: 'recommendation',
      inputData: enrichedData,
      letterText,
      htmlContent,
    });

    return {
      id: doc._id,
      letterText,
      htmlContent,
      pdfBuffer,
      createdAt: doc.createdAt,
    };
  }
}

module.exports = new RecommendationService();
