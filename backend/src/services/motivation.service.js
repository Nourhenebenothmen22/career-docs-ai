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

    let doc;
    try {
      doc = await Document.create({ type: 'motivation', inputData: data, letterText, htmlContent });
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

module.exports = new MotivationService();
