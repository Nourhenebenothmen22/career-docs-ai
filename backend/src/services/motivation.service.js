const aiService = require('./ai.service');
const promptBuilder = require('../utils/promptBuilder');
const htmlTemplate = require('../utils/htmlTemplate');
const pdfGenerator = require('../utils/pdfGenerator');
const Document = require('../models/Document');

class MotivationService {
  async generate(data) {
    const prompt = promptBuilder.buildMotivationPrompt(data);
    const letterText = await aiService.generate(prompt);
    const htmlContent = htmlTemplate.motivationLetter(data, letterText);
    const pdfBuffer = await pdfGenerator.generate(htmlContent);

    const doc = await Document.create({
      type: 'motivation',
      inputData: data,
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

module.exports = new MotivationService();
